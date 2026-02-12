import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { router } from 'expo-router';
import { tokenStorage } from '@/lib/utils/token-storage';

// --- Axios 인스턴스 생성 ---
export const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// --- 토큰 갱신 중복 방지용 플래그 & 대기열 ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}> = [];

/** 대기열에 쌓인 요청들을 일괄 처리 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

/** 토큰 제거 후 로그인 화면으로 이동 */
const forceLogout = async () => {
  await tokenStorage.clearTokens();
  router.replace('/auth/login');
};

// --- 요청 인터셉터: 모든 요청에 Access Token 부착 ---
AXIOS_INSTANCE.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 응답 인터셉터: 401 발생 시 토큰 갱신 후 재시도 ---
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401이 아니거나 이미 재시도한 요청이면 바로 에러 반환
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 이미 갱신 중이면 대기열에 추가하고 완료될 때까지 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(AXIOS_INSTANCE(originalRequest));
          },
          reject,
        });
      });
    }

    // 토큰 갱신 시작
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();

      // 리프레시 토큰 없으면 바로 로그아웃
      if (!refreshToken) {
        await forceLogout();
        return Promise.reject(error);
      }

      // 리프레시 토큰으로 새 토큰 발급
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      // 새 토큰 저장
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);

      // 원래 요청에 새 토큰 세팅 후 재시도
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      }

      // 대기열의 요청들도 새 토큰으로 처리
      processQueue(null, data.accessToken);

      return AXIOS_INSTANCE(originalRequest);
    } catch (refreshError) {
      // 갱신 실패 → 대기열 에러 처리 후 로그인 화면으로 이동
      processQueue(refreshError as Error, null);
      await forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// --- orval이 사용하는 커스텀 인스턴스 함수 ---
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore - orval 호환용 cancel 메서드
  promise.cancel = () => source.cancel('Query was cancelled');

  return promise;
};

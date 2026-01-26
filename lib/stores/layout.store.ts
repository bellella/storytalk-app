import { create } from "zustand";
import { Dimensions } from "react-native";

type LayoutStore = {
  maxContentWidth: number;
  updateMaxContentWidth: () => void;
};

const DEFAULT_MAX_WIDTH = 600;

export const useLayoutStore = create<LayoutStore>((set) => ({
  maxContentWidth: Math.min(Dimensions.get("window").width, DEFAULT_MAX_WIDTH),
  updateMaxContentWidth: () => {
    const screenWidth = Dimensions.get("window").width;
    set({
      maxContentWidth: Math.min(screenWidth, DEFAULT_MAX_WIDTH),
    });
  },
}));

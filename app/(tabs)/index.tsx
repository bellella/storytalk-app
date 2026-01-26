import React from "react";
import { FlatList, View } from "react-native";

// --- Icons (Lucide) ---
import {
  ChevronRight,
  Heart,
  Scissors,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react-native";

// --- Gluestack UI Components (@/components/ui) ---
import { AppContainer } from "@/components/app/app-container";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

// --- Mock Data ---
const CATEGORIES = [
  { id: "1", name: "Haircuts", icon: Scissors, active: true },
  { id: "2", name: "Nail", icon: null, active: false },
  { id: "3", name: "Facial", icon: null, active: false },
  { id: "4", name: "Makeup", icon: null, active: false },
  { id: "5", name: "Massage", icon: null, active: false },
];

const PRO_CARE_LIST = [
  {
    id: "1",
    name: "Bella Grace",
    role: "Hair Stylist",
    exp: "6 yrs exp",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: "2",
    name: "Daisy Scarlett",
    role: "Hair Spa",
    exp: "5 yrs exp",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "3",
    name: "John Doe",
    role: "Barber",
    exp: "8 yrs exp",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
  },
];

const NEARBY_SALONS = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

export default function MainScreen() {
  // Render Item Functions for FlatLists
  const renderCategoryItem = ({ item }: { item: (typeof CATEGORIES)[0] }) => (
    <Button
      className={cn(
        "rounded-full border-0 px-5",
        item.active && "bg-primary-500"
      )}
      variant={item.active ? "solid" : "outline"}
      action={item.active ? "primary" : "secondary"}
    >
      {item.icon && (
        <ButtonIcon
          as={item.icon}
          className={`mr-2 ${
            item.active ? "text-white" : "text-typography-900"
          }`}
        />
      )}
      <ButtonText
        className={`font-medium ${
          item.active
            ? "text-white"
            : "text-typography-900 dark:text-typography-100"
        }`}
      >
        {item.name}
      </ButtonText>
    </Button>
  );

  const renderProCareItem = ({ item }: { item: (typeof PRO_CARE_LIST)[0] }) => (
    <View className="bg-white dark:bg-background-900 p-4 rounded-2xl items-center shadow-sm w-40">
      <Avatar size="lg" className="mb-3">
        <AvatarImage source={{ uri: item.image }} alt={item.name} />
      </Avatar>
      <Heading
        size="sm"
        className="mb-1 text-typography-900 dark:text-typography-50"
      >
        {item.name}
      </Heading>
      <Text size="xs" className="text-primary-500 mb-4 font-medium">
        {item.role}
      </Text>

      <View className="w-full flex-row justify-between items-center">
        <Text size="xs" className="text-typography-500">
          {item.exp}
        </Text>
        <View className="flex-row items-center gap-1">
          <Icon as={Star} size="xs" className="text-amber-400 fill-amber-400" />
          <Text
            size="xs"
            className="font-bold text-typography-900 dark:text-typography-50"
          >
            {item.rating}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSalonItem = ({ item }: { item: (typeof NEARBY_SALONS)[0] }) => (
    <View className="rounded-xl overflow-hidden w-64 h-40 relative">
      <Image
        source={{ uri: item.image }}
        alt="Salon"
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-3 right-3 bg-white p-1.5 rounded-full">
        <Icon as={Heart} size="sm" className="text-typography-900" />
      </View>
    </View>
  );

  return (
    <AppContainer showHeaderSearch showHeaderLogo>
      <View className="flex-1 pb-10 mt-2 gap-6">
        {/* 1. Header & Search Area */}
        <View className="px-4 flex-row items-center gap-3">
          <Input className="flex-1 rounded-full h-12 bg-white dark:bg-background-900 border-0">
            <InputSlot className="pl-4">
              <InputIcon as={Search} className="text-typography-400" />
            </InputSlot>
            <InputField placeholder="Search" className="text-sm" />
          </Input>

          <Button
            className="rounded-full w-12 h-12 bg-white dark:bg-background-900"
            variant="solid"
          >
            <ButtonIcon
              as={SlidersHorizontal}
              className="text-typography-900 dark:text-typography-100"
            />
          </Button>
        </View>

        {/* 2. Categories (FlatList) */}
        <View>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          />
        </View>

        {/* 3. Special Offers Banner */}
        <View className="px-4">
          <Heading
            size="md"
            className="mb-4 text-typography-900 dark:text-typography-50"
          >
            Special Offers
          </Heading>

          <View className="h-44 rounded-2xl overflow-hidden relative justify-center">
            {/* Background Image */}
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
              }}
              alt="Barber"
              className="absolute w-full h-full"
              resizeMode="cover"
            />
            {/* Primary Overlay */}
            <View className="absolute w-full h-full bg-primary-900/60" />

            {/* Content */}
            <View className="px-6 py-4 w-[65%] gap-1">
              <Text className="text-white font-bold">Haircut</Text>
              <Heading size="2xl" className="text-white">
                20% Off
              </Heading>
              <Text size="sm" className="text-typography-200 mb-2">
                Jul 16 - Jul 24
              </Text>

              <Button
                className="bg-white rounded-full self-start mt-2 h-9 px-4"
                size="sm"
              >
                <ButtonText className="text-primary-600 font-bold">
                  Get Offer Now
                </ButtonText>
                <ButtonIcon
                  as={ChevronRight}
                  className="ml-1 text-primary-600"
                />
              </Button>
            </View>
          </View>
        </View>

        {/* 4. Pro Care at Home (FlatList) */}
        <View>
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Heading
              size="md"
              className="text-typography-900 dark:text-typography-50"
            >
              Pro Care at Home
            </Heading>
            <Pressable>
              <Text className="text-primary-500 font-semibold">See all</Text>
            </Pressable>
          </View>

          <FlatList
            data={PRO_CARE_LIST}
            renderItem={renderProCareItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            className="overflow-visible"
          />
        </View>

        {/* 5. Nearby Salons (FlatList) */}
        <View>
          <View className="px-4 mb-4 flex-row justify-between items-center">
            <Heading
              size="md"
              className="text-typography-900 dark:text-typography-50"
            >
              Nearby Salons
            </Heading>
            <Pressable>
              <Text className="text-primary-500 font-semibold">See all</Text>
            </Pressable>
          </View>

          <FlatList
            data={NEARBY_SALONS}
            renderItem={renderSalonItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          />
        </View>
      </View>
    </AppContainer>
  );
}

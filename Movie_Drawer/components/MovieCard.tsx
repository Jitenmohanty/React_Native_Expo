import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";

const MovieCard = ({
  Poster,
  Title,
  imdbRating = "N/A", // Default to "N/A" if not provided
  Year,
  imdbID,
}: {
  Poster: string;
  Title: string;
  imdbRating?: string; // Make imdbRating optional
  Year: string;
  imdbID: string;
}) => {
  // Generate a random rating between 1 and 10 if imdbRating is "N/A"
  const rating =
    imdbRating !== "N/A"
      ? Math.round(parseFloat(imdbRating) / 2) // Convert imdbRating to a number and divide by 2
      : Math.floor(Math.random() * 5) + 1; // Generate a random rating between 1 and 5

  return (
    <Link
      href={{
        pathname: "/movies/[id]",
        params: { id: imdbID }, // Pass imdbID as the dynamic route parameter
      }}
      asChild
    >
      <TouchableOpacity className="w-[30%]">
        {/* Movie Poster */}
        <Image
          source={{
            uri: Poster !== "N/A"
              ? Poster
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png", // Fallback image
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        {/* Movie Title */}
        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {Title}
        </Text>

        {/* Movie Rating */}
        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">
            {rating} {/* Display the calculated or random rating */}
          </Text>
        </View>

        {/* Movie Year and Type */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1">
            {Year}
          </Text>
          <Text className="text-xs font-medium text-light-300 uppercase">
            Movie
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
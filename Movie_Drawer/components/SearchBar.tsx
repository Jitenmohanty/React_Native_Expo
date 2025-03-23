import { View, TextInput, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <TouchableOpacity onPress={onPress}>
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
          tintColor="#AB8BFF"
        />
      </TouchableOpacity>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"
        onSubmitEditing={onPress} // Trigger search when the user presses Enter
      />
    </View>
  );
};

export default SearchBar;
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// You'll need to replace this with your actual image
// This is just a placeholder - you'll need to add your image to your assets

// Social media links
const socialLinks = [
  {
    name: "LinkedIn",
    icon: icons.linkedin,
    url: "https://www.linkedin.com/in/jiten-mohanty/",
  },
  {
    name: "GitHub",
    icon: icons.github,
    url: "https://github.com/jitenmohanty",
  },
  {
    name: "Gmail",
    icon: icons.gmail,
    url: "mailto:jitenmohantyaz@gmail.com",
  },
  {
    name: "Instagram",
    icon: icons.instagram,
    url: "https://www.instagram.com/jitujitenmohanty",
  },
  {
    name: "Twitter",
    icon: icons.twitter,
    url: "https://twitter.com/JitenMohantyDev",
  },
];

// Projects
const projects = [
  {
    name: "ATS System",
    description: "In-house applicant tracking system",
    tech: "MERN Stack",
  },
  {
    name: "Company Chat App",
    description: "Messaging app with chatbot support",
    tech: "MERN, JWT, Passport",
  },
  {
    name: "E-commerce App",
    description: "Full-featured online store",
    tech: "MERN Stack",
  },
  {
    name: "Crypto Tracker",
    description: "Real-time cryptocurrency tracking app",
    tech: "React, API Integration",
  },
  {
    name: "Recipe Finder",
    description: "App to discover and save recipes",
    tech: "React",
  },
];

// Skills
const skills = [
  "React",
  "React Native",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "JavaScript",
  "TypeScript",
  "HTML/CSS",
  "Redux",
  "Git",
  "RESTful APIs",
  "GraphQL",
  "AWS",
];

const Profile = () => {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open link", err)
    );
  };

  return (
    <View className="bg-primary flex-1 ">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with image */}
        <View className="items-center pt-8 pb-6">
          <View className="mb-4">
            {/* Profile Image with border */}
            <View className="border-2 border-blue-500 rounded-full p-1">
              <Image
                source={images.profileImage}
                className="w-32 h-32 rounded-full"
              />
            </View>
          </View>

          <Text className="text-white text-2xl font-bold">Jiten Mohanty</Text>
          <Text className="text-gray-300 text-lg">
            Full Stack & Mobile Developer
          </Text>
        </View>

        {/* About section */}
        <View className=" rounded-t-3xl px-6 pt-8 pb-32">
          <View className="mb-8">
            <Text className="text-white text-xl font-bold mb-4">About Me</Text>
            <Text className="text-gray-300 leading-6">
              I am a Full Stack Developer with experience in Mobile app
              development. Currently working as a Full Stack Developer where
              I've built several in-house projects including an ATS system and a
              chat application with chatbot support. I've also developed
              personal projects like an e-commerce platform using MERN stack, a
              cryptocurrency tracker, and a recipe finder app in React.
            </Text>
          </View>

          {/* Skills */}
          <View className="mb-8">
            <Text className="text-white text-xl font-bold mb-4">Skills</Text>
            <View className="flex flex-row flex-wrap">
              {skills.map((skill, index) => (
                <View
                  key={index}
                  className="bg-gray-700 py-2 px-3 rounded-full mr-2 mb-2"
                >
                  <Text className="text-gray-300">{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Projects */}
          <View className="mb-8">
            <Text className="text-white text-xl font-bold mb-4">Projects</Text>
            {projects.map((project, index) => (
              <View key={index} className="bg-gray-700 rounded-lg p-4 mb-3">
                <Text className="text-white font-bold">{project.name}</Text>
                <Text className="text-gray-400">{project.description}</Text>
                <Text className="text-blue-400 mt-1">{project.tech}</Text>
              </View>
            ))}
          </View>

          {/* Social Links */}
          <View>
            <Text className="text-white text-xl font-bold mb-4">
              Connect With Me
            </Text>
            <View className="flex flex-row justify-between">
              {socialLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openLink(link.url)}
                  className="items-center"
                >
                  <View className="bg-gray-700 p-3 rounded-full mb-2">
                    <Image
                      source={link.icon}
                      className="w-8 h-8"
                      // tintColor="#fff"
                    />
                  </View>
                  <Text className="text-gray-300 text-xs">{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

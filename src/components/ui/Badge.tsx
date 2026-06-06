import React from "react";
import { View, Text, StyleSheet, ViewProps, StyleProp, ViewStyle, TextStyle } from "react-native";

interface BadgeProps extends ViewProps {
  label: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({ label, color, style, textStyle, ...rest }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color || "#666" }, style]} {...rest}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
  },
});

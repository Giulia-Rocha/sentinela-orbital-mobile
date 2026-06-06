import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { darkColors } from "@/constants/colors";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "outline" | "danger";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  loading,
  variant = "primary",
  style,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineButton;
      case "danger":
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyle(), style, (disabled || loading) && styles.disabled]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? darkColors.primary : "#fff"} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: darkColors.primary,
  },
  dangerButton: {
    backgroundColor: darkColors.danger,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: darkColors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
  primaryText: {
    color: "#fff",
  },
  outlineText: {
    color: darkColors.primary,
  },
});

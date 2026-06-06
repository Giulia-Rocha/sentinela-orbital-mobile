import axios from "axios";
import { BASE_URL } from "@/constants/config";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
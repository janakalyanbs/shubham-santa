import { GiftData } from "../types";

export const niceList: Record<string, Omit<GiftData, 'recipient' | 'isInList'>> = {
  "alex": {
    "giftName": "A High-Tech Space Astronaut Suit",
    "message": "Explore the universe and reach for the stars!",
    "theme": "tech"
  },
  "sarah": {
    "giftName": "A Vintage Camera",
    "message": "Capture every beautiful moment of your journey.",
    "theme": "classic"
  },
  "john": {
    "giftName": "A Custom Electric Guitar",
    "message": "Rock around the Christmas tree and let your soul sing!",
    "theme": "classic"
  },
  "shubham": {
    "giftName": "The Master Key to the North Pole",
    "message": "You run the show now, Santa!",
    "theme": "luxury"
  },
  "priya": {
    "giftName": "Limited Edition Designer Sneakers",
    "message": "Walk into the new year with confidence and style.",
    "theme": "luxury"
  },
  "sierra": {
    "giftName": "iPhone 17 Pro Max Titanium",
    "message": "The future is in your hands. Capture magic, connect with love, and shine bright!",
    "theme": "tech"
  },
  "ranjana": {
    "giftName": "A Cute Robot Guardian",
    "message": "To my wonderful little sister: May this magical friend protect your biggest dreams and keep you smiling every single day. You are a star!",
    "theme": "whimsical"
  },
  "bhagawati": {
    "giftName": "The Lantern of Eternal Love",
    "message": "In a world full of stars, you are my only sun. You guide me through the dark and warm my soul. This light represents my love for you—burning bright, forever.",
    "theme": "luxury"
  },
  "carlsagan": {
    "giftName": "Voyager Golden Record",
    "message": "To Carl Sagan: The cosmos is within us. We are made of star-stuff. May this record carry the story of humanity across the infinite sea of space.",
    "theme": "inspiration"
  }
};

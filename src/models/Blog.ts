import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  imglink: string;
  paragraphs?: string[];
  moreImg?: string[];
  date: Date;
}

const BlogSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },

  tags: {
    type: [String],
    default: [],
  },

  imglink: {
    type: String,
    required: true,
  },

  paragraphs: {
    type: [String],
    default: [],
  },

  moreImg: {
    type: [String],
    default: [],
  },

  date: {
    type: Date,
    default: Date.now, 
  },
});

export const BlogModel = mongoose.model<IBlog>("Blog", BlogSchema);
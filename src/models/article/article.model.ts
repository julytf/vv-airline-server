import { Schema, model, connect } from 'mongoose'

export interface IArticle {
  title: string
  summary?: string
  coverImage?: string
  content: string
  isFeatured?: boolean
}

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Article = model<IArticle>('Article', articleSchema)

export default Article

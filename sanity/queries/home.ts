import { defineQuery, groq } from "next-sanity";
import { imageFields, seoQuery, videoFields } from "./fragments";
export const homePageQuery = defineQuery(
  groq`*[_type == "homePage"][0] {
    ${seoQuery},
    title,
    featuredProjects[] {
      _key,
      "title": project -> title,
      "slug": project -> slug.current,
      "featuredMedia": project -> media[0] {
        _type,
        _type == "image" => {
          ${imageFields}
        },
        _type == "video" => {
          ${videoFields}
        }
      },
      color
    },
  }`
)
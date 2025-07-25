import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";
import { visionTool } from "@sanity/vision";
import {structure} from './src/sanity/structure'
import { StudioCookie } from "./src/sanity/components/StudioCookie";

const isDev = import.meta.env.DEV;

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool({ structure }),
    ...(isDev ? [visionTool()] : []) // Only include Vision tool in development
  ],
  schema,
  studio: {
    components: {
      layout: (props) => (
        <>
          <StudioCookie />
          {props.renderDefault(props)}
        </>
      )
    }
  }
});
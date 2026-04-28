import TemplateModern from "./TemplateModern";
import TemplateBold from "./TemplateBold";
import TemplateMinimal from "./TemplateMinimal";

export default function TemplateRenderer({ template, product, content }) {
  if (!content) return null;
  if (template === "bold") return <TemplateBold product={product} content={content} />;
  if (template === "minimal") return <TemplateMinimal product={product} content={content} />;
  return <TemplateModern product={product} content={content} />;
}

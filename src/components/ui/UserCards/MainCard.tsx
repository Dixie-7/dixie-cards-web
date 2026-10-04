import UserCardBlock from './UserCardBlock';
import type { UserCardDto } from '@/types/userCards';
import { normalizeStyleText } from '@/utils/styleText';

interface MainCardProps {
  card: UserCardDto;
}

const mainCardTemplateStyles = {
  default: '',
  feature: '',
  editorial: '',
};

export default function MainCard({ card }: MainCardProps) {
  const sortedBlocks = [...card.blocks].sort(
    (currentBlock, nextBlock) => currentBlock.sortOrder - nextBlock.sortOrder,
  );
  const normalizedTemplate = card.template?.trim().toLowerCase() ?? 'default';
  const templateStyle =
    mainCardTemplateStyles[
      normalizedTemplate as keyof typeof mainCardTemplateStyles
    ] ?? mainCardTemplateStyles.default;
  const styleText = normalizeStyleText(card.styleText);

  return (
    <section className="w-full px-4 pb-8 pt-6">
      <div className={`mx-auto max-w-5xl ${templateStyle} ${styleText}`}>
        <div className="-m-2.5 flex flex-wrap">
          {sortedBlocks.map((block) => (
            <UserCardBlock key={block.id} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}

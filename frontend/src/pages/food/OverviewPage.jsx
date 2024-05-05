import { Link } from 'react-router-dom';
import { Button } from '../../components';
import { PaperLayout } from '../_layout/components';
import { useSideBar } from '../_layout/MainLayout/SideBar';

const data = [
  {
    type: 'description',
    content:
      'At GuildWeb, we provide a comprehensive dietary management system that allows you to easily set daily carbohydrate, protein, and fat targets and track your dietary intake.',
  },
  {
    type: 'title',
    content: 'Set Nutrition Goals',
  },
  {
    type: 'description',
    content:
      'On our platform, you can easily set daily carbohydrate, protein, and fat targets to ensure your diet is balanced and meets your health needs. Through our system, you can clearly visualize the gap between your current diet and your goals and view the percentage of various nutrients.',
  },
  {
    type: 'title',
    content: 'Record Ingredients and Recipes',
  },
  {
    type: 'description',
    content: `You can meticulously record the ingredients you use and the recipes you create. When recording ingredients, you can provide detailed information such as the name, unit, and nutrient type (carbohydrate, protein, or fat). Similarly, when recording recipes, you can describe each dish's ingredients and steps in detail and calculate the nutritional content based on the established ingredients and their quantities. On the daily dietary record page, you can easily select established recipes and portions to track your eating habits and nutrient intake, contributing to your health.`,
  },
  {
    type: 'title',
    content: 'Share and Search',
  },
  {
    type: 'description',
    content: `You can also set your ingredients and recipes to public, allowing other users to search and use them. This way, you can not only share your culinary creations with others but also gain inspiration from other users' ingredients and recipes.`,
  },
  {
    type: 'description',
    content: `Whether you're striving for a healthy lifestyle or exploring new culinary delights, our dietary management system meets your needs, helping you better manage your diet and enjoy a healthy and delicious life!`,
  },
  {
    type: 'description',
    content: `

    
Sincerely,

Yun-T.Z. Development Team`,
  },
];

export const OverviewPage = () => {
  useSideBar({ activeKey: ['foods', 'overview'] });

  return (
    <PaperLayout row="false" className="m-auto max-w-[720px] shadow-lg">
      <PaperLayout.Title>Dietary Management Overview</PaperLayout.Title>
      <PaperLayout.Content className="overflow-auto whitespace-pre-wrap text-primary-600">
        <div className="flex h-full flex-col items-center gap-4">
          <PaperLayout.Content className="overflow-auto whitespace-pre-wrap text-primary-600">
            <div className="flex h-full flex-col gap-4">
              {data.map(({ type, content }, i) => {
                if (type === 'title')
                  return (
                    <div key={i} className="text-heading-h2">
                      {content}
                    </div>
                  );
                return (
                  <div key={i} className="text-paragraph-p3">
                    {content}
                  </div>
                );
              })}
            </div>
          </PaperLayout.Content>
          <Link to="records">
            <Button>Start</Button>
          </Link>
        </div>
      </PaperLayout.Content>
    </PaperLayout>
  );
};

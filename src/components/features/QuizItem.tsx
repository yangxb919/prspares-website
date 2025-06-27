import Link from 'next/link';

export interface RelatedPost {
  title: string;
  href: string;
}

export interface QuizItemProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionsCount: number;
  relatedPost?: RelatedPost;
}

const QuizItem = ({
  id,
  title,
  description,
  difficulty,
  questionsCount,
  relatedPost
}: QuizItemProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200 hover:shadow-md transition-shadow">
      <Link 
        href={`/quiz/${id}`}
        className="block"
      >
        <h3 className="text-xl font-semibold text-[#333333] hover:text-[#00B140] transition-colors mb-2">
          {title}
        </h3>
      </Link>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {difficulty}
        </span>
        <span>{questionsCount} Questions</span>
      </div>
      
      {relatedPost && (
        <div className="text-sm text-gray-600 mb-4">
          Related Reading: 
          <a href={relatedPost.href} className="text-[#00B140] hover:underline ml-1">
            {relatedPost.title}
          </a>
        </div>
      )}
    </div>
  );
};

export default QuizItem;

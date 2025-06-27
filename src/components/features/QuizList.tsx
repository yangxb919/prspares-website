import QuizItem, { QuizItemProps } from './QuizItem';

interface QuizListProps {
  quizzes: QuizItemProps[];
}

const QuizList = ({ quizzes }: QuizListProps) => {
  return (
    <div className="space-y-6">
      {quizzes.map((quiz) => (
        <QuizItem key={quiz.id} {...quiz} />
      ))}
    </div>
  );
};

export default QuizList;

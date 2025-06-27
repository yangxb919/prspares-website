import Image from 'next/image';

const QuizHeader = () => {
  return (
    <div className="relative w-full h-[250px] md:h-[300px]">
      <Image
        src="https://picsum.photos/seed/prspares-quiz/1920/500"
        alt="PRSPARES Knowledge Quiz"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Knowledge Quiz</h1>
          <p className="text-lg max-w-2xl mx-auto px-4">
            Test your expertise in mobile repair and reinforce your learning outcomes
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;

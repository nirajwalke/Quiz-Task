import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  ProgressBar,
} from "react-bootstrap";
import data from "./data.json";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";

export const StarContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  min-height: 10vh;
  font-size: 10px;
`;

function App() {
  const [questions, setQuestions] = useState(
    data.map((d, index) => {
      d.index = index;
      Object.keys(d).map(
        (k) =>
          (d[k] = typeof d[k] === "string" ? decodeURIComponent(d[k]) : d[k])
      );
      d.options = [d.correct_answer, ...d.incorrect_answers].map((ans) =>
        decodeURIComponent(ans)
      );
      return d;
    })
  );
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [optionsIndexes, setOptionsIndexes] = useState([0, 1, 2, 3]);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [isSelectedCorrectAnswer, setIsSelectedCorrectAnswer] = useState();
  const [progressNowCounts, setProgressNowCounts] = useState({
    correct: 0,
    inCorrect: 0,
    pass: 75,
  });

  useEffect(() => {
    let arr = [];
    while (arr.length < 4) {
      let r = Math.floor(Math.random() * 4);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    setOptionsIndexes(arr);
  }, [currentQuestion]);

  const questionDifficulty = (level) => {
    switch (level) {
      case "hard":
        return 3;
      case "medium":
        return 2;
      case "easy":
        return 1;
      default:
        return 0;
    }
  };

  const onAnswered = (answer) => {
    setSelectedAnswer(answer);
    let total = questions.length / 100;
    let correct = 0;
    if (answer === currentQuestion.correct_answer) {
      setIsSelectedCorrectAnswer(true);
      correct = correctAnswersCount + 1;
      setCorrectAnswersCount((count) => count + 1);
    } else {
      correct = correctAnswersCount;
    }
    correct = correct / total;
    let inCorrect = (currentQuestion.index + 1) / total;
    setProgressNowCounts({
      correct: correct,
      inCorrect: inCorrect - correct,
      pass: correct > inCorrect ? 75 - correct : 75 - inCorrect,
    });
  };

  const nextQuestion = () => {
    if (questions.length > currentQuestion.index) {
      setCurrentQuestion(questions[currentQuestion.index + 1]);
      setSelectedAnswer();
      setIsSelectedCorrectAnswer();
    }
  };

  return (
    <div className="App">
      <Container>
        <Card>
          <ProgressBar
            now={((currentQuestion.index + 1) / questions.length) * 100}
          />
          <Card.Header>
            <Card.Text className="h3">
              Question {currentQuestion.index + 1} of {questions.length}{" "}
            </Card.Text>
            <Card.Text>{currentQuestion.category}</Card.Text>
            <StarContainer>
              {[...Array(3)].map((item, i) => {
                return (
                  <FaStar
                    color={
                      questionDifficulty(currentQuestion.difficulty) > i
                        ? "#000"
                        : "rgb(192,192,192)"
                    }
                  />
                );
              })}
            </StarContainer>
          </Card.Header>
          <Card.Body>
            <Card.Text>{currentQuestion.question}</Card.Text>

            <ToggleButtonGroup
              type="radio"
              name="radio-answer"
              value={selectedAnswer}
              onChange={onAnswered}
              vertical
            >
              <ToggleButton
                id="tbg-btn-1"
                name="tbg-btn-1"
                value={currentQuestion.options[optionsIndexes[0]]}
                disabled={!!selectedAnswer}
              >
                {currentQuestion.options[optionsIndexes[0]]}
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-2"
                name="tbg-btn-2"
                value={currentQuestion.options[optionsIndexes[1]]}
                disabled={!!selectedAnswer}
              >
                {currentQuestion.options[optionsIndexes[1]]}
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-3"
                name="tbg-btn-3"
                value={currentQuestion.options[optionsIndexes[2]]}
                disabled={!!selectedAnswer}
              >
                {currentQuestion.options[optionsIndexes[2]]}
              </ToggleButton>
              <ToggleButton
                id="tbg-btn-4"
                name="tbg-btn-4"
                value={currentQuestion.options[optionsIndexes[3]]}
                disabled={!!selectedAnswer}
              >
                {currentQuestion.options[optionsIndexes[3]]}
              </ToggleButton>
            </ToggleButtonGroup>

            {selectedAnswer && (
              <>
                <Card.Text>
                  {isSelectedCorrectAnswer ? "Correct" : "Sorry"}
                </Card.Text>
                <Button onClick={nextQuestion}>Next Question</Button>
              </>
            )}
            <Card.Text>Score: {progressNowCounts.correct}%</Card.Text>
            <Card.Text>Max Score: 75%</Card.Text>
            <ProgressBar>
              <ProgressBar
                variant="success"
                now={progressNowCounts.correct}
                key={1}
              />
              <ProgressBar
                variant="danger"
                now={progressNowCounts.inCorrect}
                key={2}
              />
              <ProgressBar
                variant="warning"
                now={progressNowCounts.pass}
                key={3}
              />
            </ProgressBar>
            {/* <ProgressBar now={75} /> */}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { Easy } from '../helpers/data/EasyWords';
import { Normal } from '../helpers/data/NormalWords';
import { Expert } from '../helpers/data/ExpertWords';
import {
  GetCrossword,
  GetCorrectAnswer,
  UpdateCrossword,
  SetAnswer
} from '../helpers/functions';
import { Crossword, CrosswordPuzzle } from '../helpers/models/Crossword';

const CrosswordContainer: React.FC<{level: string}> = (props) => {
  let initialValue: Crossword = {
    puzzle: [],
    height: 0,
    width: 0,
    currentIndexes: [],
    horizon: false
  }

  const [data, setData] = useState<Crossword>(initialValue);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [selectedIndexes, setSelectedIndexes] = useState<number[][]>([]);

  const crosswordRef = React.useRef(data);
  const correctAnswerRef = React.useRef(correctAnswer);
  const selectedIndexesRef = React.useRef(selectedIndexes);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, []);

  useEffect(() => {
    if (props.level === 'easy' && Easy.length > 0) {
      setData(GetCrossword(Easy, 5));
    }
    if (props.level === 'normal' && Normal.length > 0) {
      setData(GetCrossword(Normal, 10));
    }
    if (props.level === 'expert' && Expert.length > 0) {
      setData(GetCrossword(Expert, 20));
    }
  }, [props.level]);

  const clickItemHandler = (item: CrosswordPuzzle) => {
    if (!item.empty && !item.done) {
      UpdateCrossword(item, data).then((newCrossword: Crossword) => {
        setCrosswordArray({ ...newCrossword });
        setSelectedIndexes(newCrossword.currentIndexes);
      });
      
      const answer = GetCorrectAnswer(item);
      correctAnswerRef.current = answer;
      setCorrectAnswer(answer);
    }
  }

  const setCrosswordArray = (data: Crossword) => {
    crosswordRef.current = data;
    setData(data);
  };

  const handleKeyDown = (event: any) => {
    let temp = { ...crosswordRef.current };

    SetAnswer(temp, event.key, selectedIndexesRef.current, correctAnswerRef.current)
      .then((newCrossword: Crossword) => {
        setData({ ...newCrossword });
        setSelectedIndexes(newCrossword.currentIndexes);
      });
  };

  return (
    <div className='p-2' style={{ height: 'calc(100vh - 75px)' }}>
      {data.puzzle.map((item, index) => {
        return (
          <div
            key={index}
            style={{
              alignContent: 'flex-start',
              display: 'flex',
              height: `${100 / data.height}%`
            }}
          >
            {item.map(subItem => {
              return (
                <div
                  key={subItem.key}
                  className='text-center'
                  style={{
                    backgroundColor: subItem.done ? '#FFF' : subItem.clicked ? '#E6CBF5' : '#FFF',
                    borderColor: 'gray',
                    borderStyle: subItem.empty ? 'none' : 'solid',
                    borderWidth: 1,
                    fontSize: 24,
                    height: '100%',
                    width: `${100 / data.width}%`
                  }}
                  onClick={() => clickItemHandler(subItem)}
                >
                  {subItem.done ? subItem.alphabet : subItem.userInput}
                </div>
              );
            })}
          </div>
        );
      })}
    </div >
  );
};

export default CrosswordContainer;
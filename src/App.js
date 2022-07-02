import logo from './logo.svg';
import './App.css';
import countryData from './data';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import wordsToNumbers from 'words-to-numbers';
import { motion, AnimatePresence } from "framer-motion";


const getFirstNumber = (str) => {
  const int = str.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;}).shift();
  return int;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function App() {
  const [guessed, setGuessed] = useState(false);
  const [resultColor, setResultColor] = useState(false);
  const [points, setPoints] = useState(null);
  const [guesses, setGuesses] = useState(null);

  const [newPoints, setNewPoints] = useState(null);


  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async data => {
    setGuessed(true)

    console.log(data)

    const int = getFirstNumber(data.population);
    console.log(int)



    console.log(data.population.substring(int.toString().length))
    const intFromString = wordsToNumbers(data.population.substring(int.toString().length), {fuzzy: true})
    console.log(intFromString)

    let finalGuess;  



    if (data.population.substring(int.toString().length + 1) < 1) {
      finalGuess = int;
      console.log(finalGuess)
    } else {
      finalGuess = int * intFromString;
      console.log(finalGuess)
    }

    console.log(finalGuess)

  

    const difference = currentCountry.population - finalGuess;

    await sleep(900)

    const guessesInt = parseInt(localStorage.getItem('guesses')) + 1;

    localStorage.setItem('guesses', guessesInt)
    setGuesses(guessesInt)


    if (difference > -100000 && difference < 100000) {
      setNewPoints(5)
      const pointsInt = parseInt(localStorage.getItem('points')) + 5;
      localStorage.setItem('points', pointsInt)
      setPoints(pointsInt)
      setResultColor("resultGood")
    } else if (difference > -1100000 && difference < 1100000) {
      setNewPoints(2)
      const pointsInt = parseInt(localStorage.getItem('points')) + 2;
      localStorage.setItem('points', pointsInt)
      setPoints(pointsInt)
      setResultColor("resultMedium")
    } else {
      setNewPoints(0)
      setResultColor("resultBad")
    }

    setResult(difference);

  }

  const [currentCountry, setCurrentCountry] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const randomCountry = countryData[Math.floor(Math.random() * countryData.length)];
    setCurrentCountry(randomCountry);
    
    if (!localStorage.getItem('points') ) {
      localStorage.setItem('points', 0);
    } 

    if (!localStorage.getItem('guesses') ) {
      localStorage.setItem('guesses', 0);
    }

    setPoints(localStorage.getItem('points'));
    setGuesses(localStorage.getItem('guesses'));





  }, [])

  useEffect(() => {
    if (currentCountry && !guessed) {
      var input = document.getElementById('guessInput');
      input.focus();
      input.select();
    }
  }, [currentCountry])

  const next = async () => {
    setResult(false)

    await sleep(900)
    const randomCountry = countryData[Math.floor(Math.random() * countryData.length)];
    setCurrentCountry(randomCountry);
    console.log(register)

    setGuessed(false)
  

  }

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <div className="contentWrapper">
        <form className="content" onSubmit={handleSubmit(onSubmit)}>
          { currentCountry && (
            <>
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                key="img"
                exit={{ opacity: 0 }}
                src={ "https://countryflagsapi.com/png/" + currentCountry.country }
              />

              <h1>Guess the population of { currentCountry.country }</h1>
              <AnimatePresence>
                { !guessed && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      key="input"
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="guess"
                    >
                      <input className="input" id="guessInput" type="guess" placeholder="12 million" {...register("population")} />
                                
                      <input className="button" type="submit" />
                    </motion.div>
                    <p className="examples">examples: "10 mil", "40000", "700 thousand, etc"</p>
                  </>
                )}
                { result && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    key="result"
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="results"
                  >
                    <p>your guess was out by <span className={ `number ${resultColor}` }>{ result.toLocaleString() }</span></p>
                    
                    <p>the population is <span className={ `number` }>{ currentCountry.population.toLocaleString() }</span></p>

                    <p>you earned <span className={ `number` }>{ newPoints }</span> points</p>

                    <button type="button" onClick={() => next()} className="next">next</button>
                  </motion.div>
                )}
              </AnimatePresence>



            </>
          )}
        
        </form>
        <div className="footer">
          <p>you have { points } points from { guesses } guesses</p>
        </div>
    </div>
  );
}

export default App;

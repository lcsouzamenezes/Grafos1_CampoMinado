const TIMER = {
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's'
  };
  
  const timerCalc = (time) => {
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((time % (1000 * 60)) / 1000);
  
      return {
          days,
          hours,
          minutes,
          seconds
      };
  }
  
  // Handle minefield timer
  const startTimer = () => {
      const startTime = new Date();
  
      const updateTimer = () => {
          const currentTime = new Date();
          const time = currentTime - startTime;
          const timer = timerCalc(time);
  
          const value = Object.entries(timer)
              .map(([k, v]) => {
                  // If it's a valid value
                  if (v > 0) {
                      return `${v}${TIMER[k]}`;
                  }
                  return false;
              })
              .filter(v => v)
              .join(' ');
  
          document.getElementById('timer').innerHTML = value;
      }
  
      // 1 second interval
      window.setInterval(updateTimer, 1000);
  }
  
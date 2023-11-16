import { useEffect, useMemo, useState } from 'react';
import { Fish } from '../components/fish';
import Panel from '../components/panel';

function App() {
  const [type, setType] = useState(0);
  const [num, setNum] = useState(0);
  const [vel, setVel] = useState(0);
  const [time, setTime] = useState(0);
  const [color, setColor] = useState('#3DADFE');

  const randNum = useMemo(() => {
    return new Array(num).fill('').map((value, index) => {
      return [Math.random(), Math.random(), Math.random()];
    });
  }, [num]);

  const pos = useMemo(() => {
    return new Array(num).fill('').map((value, index) => {
      let x, y;
      x = time * Math.cos(2 * Math.PI * randNum[index][2]) * -1;
      y = time * Math.sin(2 * Math.PI * randNum[index][2]) * -1;
      return { x, y };
    });
  }, [vel, time, num]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((time) => time + vel * 0.01);
    }, 10);

    return () => {
      clearInterval(timer);
    };
  }, [vel]);

  return (
    <div className="App" style={{ color }}>
      <Panel
        setType={setType}
        setNum={setNum}
        setVel={setVel}
        color={color}
        setColor={setColor}
      />
      {new Array(num).fill('').map((value, index) => {
        return (
          <Fish
            type={type}
            deg={360 * randNum[index][2]}
            y={((randNum[index][1] * 90 + pos[index].y) % 100) + 'vh'}
            x={((randNum[index][0] * 60 + pos[index].x) % 100) + 'vw'}
            key={index}
          ></Fish>
        );
      })}
    </div>
  );
}

export default App;

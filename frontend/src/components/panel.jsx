import '../styles/panel.css';
import { Fish } from '../components/fish';

const Panel = ({ setType, setNum, num, setVel, vel, color, setColor }) => {
  return (
    <>
      <div className="panelcontainer">
        <div className="panelname">Fish Bowl</div>
        <div className="setting">
          <div className="alinecenter">
            數量{' '}
            <input
              type="number"
              value={num}
              onChange={(event) => setNum(+event.target.value)}
            />
          </div>
          <div className="alinecenter">
            速度{' '}
            <input
              value={vel}
              type="number"
              onChange={(event) => setVel(+event.target.value)}
            />
          </div>
        </div>
        <div className="model">
          <Fish type={0} y={`0px`} x={`0px`} onClick={() => setType(0)} />
          <Fish type={1} y={`10px`} x={`125px`} onClick={() => setType(1)} />
          <Fish type={2} y={`-15px`} x={`235px`} onClick={() => setType(2)} />
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </>
  );
};

export default Panel;

import '../styles/fish.css';

const a = ['img/fish_drop.svg', 'img/fish_rect.svg', 'img/fish_tri.svg'];

export const Fish = ({ type, deg, x, y, onClick }) => {
  return (
    <>
      <div
        onClick={onClick}
        style={{
          transform: `rotate(${deg}deg)`,
          position: 'absolute',
          top: `${y}`,
          left: `${x}`,
        }}
      >
        <img src={a[type]}></img>
      </div>
    </>
  );
};

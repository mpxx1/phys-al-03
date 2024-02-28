import './App.css'
import {Layer, Stage, Circle, Arrow} from "react-konva";
import {useState} from "react";


type Point = {
    x: number
    y: number
}

type Charge = {
    position:   Point
    radius:     number
    q:          number
}

type Vector = {
    start: {x: number, y: number},
    end: {x: number, y: number},
}

const defaultCharge = (): Charge => {
    return {
        position: {x: 100, y: 100},
        radius: 10,
        q: 0,
    }
}


function App() {

    const [charges, setCharges] = useState<Charge[]>(
        [defaultCharge(), defaultCharge(), defaultCharge(), defaultCharge(), defaultCharge()]
        );

    const width: number = 1450;
    const height: number = 850;

    const updateCharge = (index: number, charge: Charge) => {
        const chargesCopy = [...charges];
        chargesCopy[index] = charge;
        setCharges(chargesCopy);
    }

    const onValueChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            updateCharge(
                index, {...charges[index], q: Number.parseFloat(event.target.value)}
            )
        } catch (error) {
            alert(error)
        }
    }

    const circules = charges
        .map((charge, index) => {

            if (charge.q != 0) {
                return <Circle
                    draggable
                    onDragMove={(event) => {
                        updateCharge(index, {
                            ...charge,
                            position: {x: event.target.x(), y: event.target.y()},
                            radius: charge.radius
                        });
                    }}
                    onDragEnd={(event) => {
                        updateCharge(index, {
                            ...charge,
                            position: {x: event.target.x(), y: event.target.y()},
                            radius: charge.radius
                        });
                    }}
                    key={index}
                    x={charge.position.x}
                    y={charge.position.y}
                    radius={charge.radius}
                    fill={"red"}
                />
            } else {
                return null;
            }
    })

    const B = (x: number, y: number, charge: Charge) => {
        const dist = Math.sqrt((x - charge.position.x) ** 2 + (y - charge.position.y) ** 2);

        if (dist > 0) {
            const k = (10 ** -7) * Math.abs(charge.q) / (dist ** 2)
            const mu = 11 ** 9;

            if (charge.q >= 0) {
                return {
                    start: {x: 0, y: 0},
                    end: {
                        x: (y - charge.position.y) * k * mu,
                        y: (charge.position.x - x) * k * mu,
                    }
                }
            } else {
                return {
                    start: {x: 0, y: 0},
                    end: {
                        x: (charge.position.y - y) * k * mu,
                        y: (x - charge.position.x) * k * mu,
                    }
                }
            }
        }

        return {start: {x: 0, y: 0}, end: {x: 0, y: 0}};
    }

    const vecSum = (first: Vector, second: Vector) => {
        return {
            start: {
                x: first.start.x + second.start.x,
                y: first.start.y + second.start.y,
            },
            end: {
                x: first.end.x + second.end.x,
                y: first.end.y + second.end.y,
            }
        }
    }

    const calcBForField = () => {
        const vectors: Vector[] = [];
        for (let i = 0; i < width; i += 50) {
            for (let j = 0; j < height; j += 50) {
                let vec: Vector = {start: {x: i, y: j}, end: {x: i, y: j}};
                for (const charge of charges) {
                    vec = vecSum(vec, B(i, j, charge))
                }
                vectors.push(vec);
            }
        }

        return vectors;
    }

    const vectorsData = calcBForField();

    const vectors = vectorsData.map(vector => {
        return <Arrow
            points={[vector.start.x, vector.start.y, vector.end.x, vector.end.y]}
            fill={"black"}
            stroke={"black"}
        />
    })

    return (
      <div className={"wrapper"}>
          <div className={"inputWrapper"}>
              <label> Enter the values of electric charge </label>
              <label> Positive charge is directed towards us </label>
              <label> Negative charge is directed away from us </label>
              <div>
                  <input
                      onChange={(event) => onValueChange(0, event)}
                      placeholder={"1"}
                  />
              </div>

              <div>
                  <input
                      onChange={(event) => onValueChange(1, event)}
                      placeholder={"2"}
                  />
              </div>

              <div>
                  <input
                      onChange={(event) => onValueChange(2, event)}
                      placeholder={"3"}
                  />
              </div>

              <div>
                  <input
                      onChange={(event) => onValueChange(3, event)}
                      placeholder={"4"}
                  />
              </div>

              <div>
                  <input
                      onChange={(event) => onValueChange(4, event)}
                      placeholder={"5"}
                  />
              </div>
          </div>


          <div>
              <Stage width={width} height={height}>
                  <Layer>
                      {vectors}
                      {circules}
                  </Layer>
              </Stage>
          </div>
      </div>
    );
}

export default App

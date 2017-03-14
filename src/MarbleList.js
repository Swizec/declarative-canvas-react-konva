
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Stage, Layer, Group } from 'react-konva';


import Marble from './Marble';

const MarbleList = inject('physics')(observer(({ physics }) => {
    const { width, height, marbles, marbleTypes } = physics;

    return (
        <Stage width={width} height={height}>
            <Layer>
                <Group>
                    {marbles.map(({ x, y, id }, i) => (
                        <Marble x={x}
                                y={y}
                                type={marbleTypes[i%marbleTypes.length]}
                                draggable="true"
                                id={id}
                                key={`marble-${id}`} />
                    ))}
                </Group>
            </Layer>
        </Stage>
    );
}));

export default MarbleList;

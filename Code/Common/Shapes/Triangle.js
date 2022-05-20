/////////////////////////////////////////////////////////////////////////////
//
//  --- Triangle.js ---
//

const EquilateralTriangle = 0;
const RightTriangle = 1;

function Triangle(shape, vertexShader, fragmentShader) {
  
    shape ||= EquilateralTriangle;
    if (shape != EquilateralTriangle && shape != RightTriangle) {
        alert("Triangle: invalid shape specified");
        return;
    }

    if (typeof vertexShader === 'undefined') {
        let coords;

        switch(shape) {
            case EquilateralTriangle:
                coords = `
                    const float Pi = 3.14159265359;
                    float vid = float(gl_VertexID);
                    float angle = vid * 2.0 * Pi / 3.0 + 0.5 * Pi;
                    float x = 0.5 * cos(angle);
                    float y = 0.5 * sin(angle) - 0.125;
                `;
                break;

            case RightTriangle:
                coords = `
                    float x = float(gl_VertexID % 2) - 0.5;
                    float y = float(gl_VertexID / 2) - 0.5;
                `;
                break;
        }

        vertexShader = `
            uniform mat4 P;
            uniform mat4 MV;

            void main() {
                ${coords}
                gl_PointSize = 5.0;
                gl_Position = P * MV * vec4(x, y, 0.0, 1.0);
            }
        `;

        console.log(vertexShader);
    }

    fragmentShader ||= `
        uniform vec4 color;

        out vec4 fColor;

        void main() {
            fColor = color;
        }
    `;

    let defaultProgram = initShaders(gl, vertexShader, fragmentShader);

    let P = gl.getUniformLocation(defaultProgram, "P");
    let MV = gl.getUniformLocation(defaultProgram, "MV");
    let color = gl.getUniformLocation(defaultProgram, "color");

    this.program = defaultProgram;
    this.P = mat4();
    this.MV = mat4();
    this.color = vec4(1.0, 0.0, 1.0, 1.0);

    this.render = function() {
        gl.useProgram( this.program );

        gl.uniformMatrix4fv( P, false, flatten(this.P) );
        gl.uniformMatrix4fv( MV, false, flatten(this.MV) );
        gl.uniform4fv( color, this.color );

        let topology = this.wireframe ? gl.LINE_LOOP : gl.TRIANGLES;
        gl.drawArrays(topology, 0, 3);
    };
};
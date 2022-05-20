/////////////////////////////////////////////////////////////////////////////
//
//  --- Quad.js ---
//

function Quad(vertexShader, fragmentShader) {
  
    vertexShader ||= `
        uniform mat4  P;
        uniform mat4  MV;

        void main() {
            vec2 v;
            v.x = float(gl_VertexID == 1 || gl_VertexID == 2);
            v.y = float(gl_VertexID / 2);
            v -= 0.5;

            gl_Position = P * MV * vec4(v, 0.0, 1.0);
        }
    `;
    
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

        let topology = this.wireframe ? gl.LINE_LOOP : gl.TRIANGLE_FAN;
        gl.drawArrays(topology, 0, 4);
    };
};
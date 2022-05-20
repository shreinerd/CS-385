/////////////////////////////////////////////////////////////////////////////
//
//  --- Disk.js ---
//

function Disk(vertexShader, fragmentShader) {
  
    vertexShader ||= `
        uniform mat4  P;
        uniform mat4  MV;
        uniform float  slices;

        void main() {
            const float PI = 3.141592653589793;
            
            float angle = float(gl_VertexID) * 2.0 * PI / (slices - 1.0);
            vec2 v = float(gl_VertexID > 0) * vec2(cos(angle), sin(angle));
            v *= 0.90;
            
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
    let slices = gl.getUniformLocation(defaultProgram, "slices");

    this.program = defaultProgram;
    this.P = mat4();
    this.MV = mat4();
    this.color = vec4(1.0, 0.0, 1.0, 1.0);
    this.slices = 10;

    this.render = function() {
        gl.useProgram( this.program );

        gl.uniformMatrix4fv( P, false, flatten(this.P) );
        gl.uniformMatrix4fv( MV, false, flatten(this.MV) );
        gl.uniform4fv( color, this.color );
        gl.uniform1f( slices, this.slices );

        let topology = this.wireframe ? gl.LINE_STRIP : gl.TRIANGLE_FAN;
        gl.drawArrays(topology, 0, this.slices + 1);
    };
};
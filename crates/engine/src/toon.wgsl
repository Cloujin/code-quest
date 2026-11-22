const SRGB_GAMMA: f32 = 2.2;

struct Globals {
    view_projection: mat4x4<f32>,
    light: vec4<f32>,
    ambient: vec4<f32>,
};

struct Object {
    model: mat4x4<f32>,
    tint: vec4<f32>,
};

@group(0) @binding(0) var<uniform> globals: Globals;
@group(1) @binding(0) var<uniform> object: Object;

struct VertexIn {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) color: vec3<f32>,
};

struct VertexOut {
    @builtin(position) clip: vec4<f32>,
    @location(0) normal: vec3<f32>,
    @location(1) color: vec3<f32>,
};

@vertex
fn vs_main(vertex: VertexIn) -> VertexOut {
    var out: VertexOut;
    let world = object.model * vec4<f32>(vertex.position, 1.0);
    out.clip = globals.view_projection * world;
    out.normal = (object.model * vec4<f32>(vertex.normal, 0.0)).xyz;
    out.color = pow(vertex.color * object.tint.rgb, vec3<f32>(SRGB_GAMMA));
    return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
    let towards_light = normalize(-globals.light.xyz);
    let diffuse = max(dot(normalize(in.normal), towards_light), 0.0);
    let bands = globals.light.w;
    let stepped = ceil(diffuse * bands) / bands;
    let shade = globals.ambient.rgb + (vec3<f32>(1.0) - globals.ambient.rgb) * stepped;
    return vec4<f32>(in.color * shade, 1.0);
}

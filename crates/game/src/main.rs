use engine::{Game, Input, Key, Mesh, ObjectId, Quat, Scene, Transform, Vec3};

const GRASS: [f32; 3] = [0.42, 0.72, 0.36];
const BARK: [f32; 3] = [0.48, 0.32, 0.2];
const LEAVES: [f32; 3] = [0.2, 0.55, 0.3];
const CRATE: [f32; 3] = [0.95, 0.62, 0.25];
const ORBIT_RADIANS_PER_SECOND: f32 = 1.5;
const ZOOM_UNITS_PER_SECOND: f32 = 8.0;
const SPIN_RADIANS_PER_SECOND: f32 = 0.8;

struct Sandbox {
    crate_box: Option<ObjectId>,
    orbit: f32,
    distance: f32,
}

impl Game for Sandbox {
    fn setup(&mut self, scene: &mut Scene) {
        let ground = scene.add_mesh(Mesh::plane(40.0, GRASS));
        scene.spawn(ground, Transform::default());

        let tree = scene.add_mesh(
            Mesh::cylinder(0.25, 1.0, 6, BARK)
                .merged(Mesh::cone(1.2, 2.2, 7, LEAVES), Vec3::new(0.0, 0.9, 0.0)),
        );
        for (x, z) in [
            (-5.0, -3.0),
            (4.0, -6.0),
            (6.5, 2.0),
            (-3.0, 5.0),
            (-8.0, 1.0),
        ] {
            scene.spawn(tree, Transform::at(Vec3::new(x, 0.0, z)));
        }

        let crate_mesh = scene.add_mesh(Mesh::cube(1.5, CRATE));
        self.crate_box = Some(scene.spawn(crate_mesh, Transform::at(Vec3::new(0.0, 0.75, 0.0))));
    }

    fn update(&mut self, scene: &mut Scene, input: &Input, seconds: f32) {
        self.orbit += input.axis(Key::KeyA, Key::KeyD) * ORBIT_RADIANS_PER_SECOND * seconds;
        self.distance = (self.distance
            + input.axis(Key::KeyW, Key::KeyS) * ZOOM_UNITS_PER_SECOND * seconds)
            .clamp(4.0, 30.0);
        scene.camera.eye = Vec3::new(self.orbit.sin(), 0.5, self.orbit.cos()) * self.distance;

        if let Some(crate_box) = self.crate_box {
            let transform = scene.transform_mut(crate_box);
            transform.rotation =
                Quat::from_rotation_y(SPIN_RADIANS_PER_SECOND * seconds) * transform.rotation;
        }
    }
}

fn main() {
    env_logger::init();
    engine::run(
        "Code Quest",
        Sandbox {
            crate_box: None,
            orbit: 0.0,
            distance: 12.0,
        },
    );
}

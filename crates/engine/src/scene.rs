use glam::{Mat4, Quat, Vec3};

use crate::{Camera, Mesh};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct MeshId(pub(crate) usize);

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ObjectId(pub(crate) usize);

#[derive(Clone, Copy, Debug)]
pub struct Transform {
    pub translation: Vec3,
    pub rotation: Quat,
    pub scale: Vec3,
}

impl Default for Transform {
    fn default() -> Self {
        Self {
            translation: Vec3::ZERO,
            rotation: Quat::IDENTITY,
            scale: Vec3::ONE,
        }
    }
}

impl Transform {
    pub fn at(translation: Vec3) -> Self {
        Self {
            translation,
            ..Self::default()
        }
    }

    pub fn matrix(&self) -> Mat4 {
        Mat4::from_scale_rotation_translation(self.scale, self.rotation, self.translation)
    }
}

pub struct Light {
    pub direction: Vec3,
    pub ambient: [f32; 3],
    pub bands: f32,
}

impl Default for Light {
    fn default() -> Self {
        Self {
            direction: Vec3::new(-0.4, -1.0, -0.6),
            ambient: [0.35, 0.38, 0.45],
            bands: 3.0,
        }
    }
}

pub(crate) struct Object {
    pub mesh: MeshId,
    pub transform: Transform,
    pub tint: [f32; 3],
}

pub struct Scene {
    pub camera: Camera,
    pub light: Light,
    pub sky: [f64; 3],
    pub(crate) meshes: Vec<Mesh>,
    pub(crate) objects: Vec<Object>,
}

impl Default for Scene {
    fn default() -> Self {
        Self {
            camera: Camera::default(),
            light: Light::default(),
            sky: [0.55, 0.78, 0.95],
            meshes: Vec::new(),
            objects: Vec::new(),
        }
    }
}

impl Scene {
    pub fn add_mesh(&mut self, mesh: Mesh) -> MeshId {
        self.meshes.push(mesh);
        MeshId(self.meshes.len() - 1)
    }

    pub fn spawn(&mut self, mesh: MeshId, transform: Transform) -> ObjectId {
        self.objects.push(Object {
            mesh,
            transform,
            tint: [1.0; 3],
        });
        ObjectId(self.objects.len() - 1)
    }

    pub fn transform_mut(&mut self, object: ObjectId) -> &mut Transform {
        &mut self.objects[object.0].transform
    }

    pub fn set_tint(&mut self, object: ObjectId, tint: [f32; 3]) {
        self.objects[object.0].tint = tint;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn spawned_objects_keep_their_own_transform() {
        let mut scene = Scene::default();
        let cube = scene.add_mesh(Mesh::cube(1.0, [1.0; 3]));
        let first = scene.spawn(cube, Transform::at(Vec3::X));
        let second = scene.spawn(cube, Transform::at(Vec3::Y));
        scene.transform_mut(first).translation = Vec3::Z;
        assert_eq!(scene.objects[first.0].transform.translation, Vec3::Z);
        assert_eq!(scene.objects[second.0].transform.translation, Vec3::Y);
    }

    #[test]
    fn transform_matrix_scales_then_rotates_then_moves() {
        let transform = Transform {
            translation: Vec3::new(5.0, 0.0, 0.0),
            rotation: Quat::from_rotation_y(std::f32::consts::FRAC_PI_2),
            scale: Vec3::splat(2.0),
        };
        let moved = transform.matrix().transform_point3(Vec3::X);
        assert!((moved - Vec3::new(5.0, 0.0, -2.0)).length() < 1e-5);
    }
}

use glam::camera::rh::{proj::directx::perspective, view::look_at_mat4};
use glam::{Mat4, Vec3};

pub struct Camera {
    pub eye: Vec3,
    pub target: Vec3,
    pub up: Vec3,
    pub fov_y_radians: f32,
    pub near: f32,
    pub far: f32,
}

impl Default for Camera {
    fn default() -> Self {
        Self {
            eye: Vec3::new(0.0, 6.0, 12.0),
            target: Vec3::ZERO,
            up: Vec3::Y,
            fov_y_radians: 50f32.to_radians(),
            near: 0.1,
            far: 200.0,
        }
    }
}

impl Camera {
    pub fn view_projection(&self, aspect: f32) -> Mat4 {
        let view = look_at_mat4(self.eye, self.target, self.up);
        let projection = perspective(self.fov_y_radians, aspect, self.near, self.far);
        projection * view
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn target_lands_in_the_centre_of_the_screen() {
        let camera = Camera::default();
        let clip = camera.view_projection(16.0 / 9.0) * camera.target.extend(1.0);
        let ndc = clip.truncate() / clip.w;
        assert!(ndc.x.abs() < 1e-5);
        assert!(ndc.y.abs() < 1e-5);
        assert!((0.0..=1.0).contains(&ndc.z));
    }

    #[test]
    fn points_behind_the_far_plane_are_clipped() {
        let camera = Camera::default();
        let beyond = camera.eye + (camera.target - camera.eye).normalize() * (camera.far * 2.0);
        let clip = camera.view_projection(1.0) * beyond.extend(1.0);
        assert!(clip.z / clip.w > 1.0);
    }
}

use std::f32::consts::TAU;

use bytemuck::{Pod, Zeroable};
use glam::Vec3;

#[repr(C)]
#[derive(Clone, Copy, Debug, Pod, Zeroable)]
pub struct Vertex {
    pub position: [f32; 3],
    pub normal: [f32; 3],
    pub color: [f32; 3],
}

#[derive(Clone, Debug, Default)]
pub struct Mesh {
    pub vertices: Vec<Vertex>,
}

impl Mesh {
    pub fn from_triangles(triangles: impl IntoIterator<Item = [Vec3; 3]>, color: [f32; 3]) -> Self {
        let mut vertices = Vec::new();
        for [a, b, c] in triangles {
            let normal = (b - a).cross(c - a).normalize_or_zero().to_array();
            for corner in [a, b, c] {
                vertices.push(Vertex {
                    position: corner.to_array(),
                    normal,
                    color,
                });
            }
        }
        Self { vertices }
    }

    pub fn plane(size: f32, color: [f32; 3]) -> Self {
        let h = size / 2.0;
        let corners = [
            Vec3::new(-h, 0.0, -h),
            Vec3::new(-h, 0.0, h),
            Vec3::new(h, 0.0, h),
            Vec3::new(h, 0.0, -h),
        ];
        Self::from_triangles(quad(corners), color)
    }

    pub fn cube(size: f32, color: [f32; 3]) -> Self {
        let h = size / 2.0;
        let p = |x: f32, y: f32, z: f32| Vec3::new(x * h, y * h, z * h);
        let faces = [
            [
                p(-1., -1., 1.),
                p(1., -1., 1.),
                p(1., 1., 1.),
                p(-1., 1., 1.),
            ],
            [
                p(1., -1., -1.),
                p(-1., -1., -1.),
                p(-1., 1., -1.),
                p(1., 1., -1.),
            ],
            [
                p(1., -1., 1.),
                p(1., -1., -1.),
                p(1., 1., -1.),
                p(1., 1., 1.),
            ],
            [
                p(-1., -1., -1.),
                p(-1., -1., 1.),
                p(-1., 1., 1.),
                p(-1., 1., -1.),
            ],
            [
                p(-1., 1., 1.),
                p(1., 1., 1.),
                p(1., 1., -1.),
                p(-1., 1., -1.),
            ],
            [
                p(-1., -1., -1.),
                p(1., -1., -1.),
                p(1., -1., 1.),
                p(-1., -1., 1.),
            ],
        ];
        Self::from_triangles(faces.into_iter().flat_map(quad), color)
    }

    pub fn cone(radius: f32, height: f32, segments: u32, color: [f32; 3]) -> Self {
        let apex = Vec3::new(0.0, height, 0.0);
        let ring = ring(radius, 0.0, segments);
        let mut triangles = Vec::new();
        for i in 0..ring.len() {
            let (a, b) = (ring[i], ring[(i + 1) % ring.len()]);
            triangles.push([a, b, apex]);
            triangles.push([b, a, Vec3::ZERO]);
        }
        Self::from_triangles(triangles, color)
    }

    pub fn cylinder(radius: f32, height: f32, segments: u32, color: [f32; 3]) -> Self {
        let top_centre = Vec3::new(0.0, height, 0.0);
        let bottom = ring(radius, 0.0, segments);
        let top = ring(radius, height, segments);
        let mut triangles = Vec::new();
        for i in 0..bottom.len() {
            let j = (i + 1) % bottom.len();
            triangles.extend(quad([bottom[i], bottom[j], top[j], top[i]]));
            triangles.push([top[i], top[j], top_centre]);
            triangles.push([bottom[j], bottom[i], Vec3::ZERO]);
        }
        Self::from_triangles(triangles, color)
    }

    pub fn merged(mut self, other: Mesh, offset: Vec3) -> Self {
        self.vertices
            .extend(other.vertices.into_iter().map(|mut v| {
                v.position = (Vec3::from(v.position) + offset).to_array();
                v
            }));
        self
    }
}

fn quad([a, b, c, d]: [Vec3; 4]) -> [[Vec3; 3]; 2] {
    [[a, b, c], [a, c, d]]
}

fn ring(radius: f32, y: f32, segments: u32) -> Vec<Vec3> {
    (0..segments)
        .map(|i| {
            let angle = TAU * i as f32 / segments as f32;
            Vec3::new(radius * angle.cos(), y, -radius * angle.sin())
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn assert_faces_point_outward(mesh: &Mesh, centre: Vec3) {
        assert!(!mesh.vertices.is_empty());
        for triangle in mesh.vertices.chunks(3) {
            let normal = Vec3::from(triangle[0].normal);
            assert!((normal.length() - 1.0).abs() < 1e-4);
            let face_centre = triangle
                .iter()
                .map(|v| Vec3::from(v.position))
                .sum::<Vec3>()
                / 3.0;
            assert!(
                normal.dot(face_centre - centre) > 0.0,
                "inward face at {face_centre}"
            );
        }
    }

    #[test]
    fn cube_has_twelve_outward_triangles() {
        let cube = Mesh::cube(2.0, [1.0; 3]);
        assert_eq!(cube.vertices.len(), 36);
        assert_faces_point_outward(&cube, Vec3::ZERO);
    }

    #[test]
    fn cone_faces_point_outward() {
        assert_faces_point_outward(&Mesh::cone(1.0, 2.0, 7, [1.0; 3]), Vec3::new(0.0, 0.5, 0.0));
    }

    #[test]
    fn cylinder_faces_point_outward() {
        assert_faces_point_outward(
            &Mesh::cylinder(1.0, 2.0, 6, [1.0; 3]),
            Vec3::new(0.0, 1.0, 0.0),
        );
    }

    #[test]
    fn plane_faces_up() {
        let plane = Mesh::plane(4.0, [1.0; 3]);
        assert!(plane.vertices.iter().all(|v| v.normal == [0.0, 1.0, 0.0]));
    }

    #[test]
    fn merged_offsets_the_second_mesh() {
        let merged = Mesh::plane(2.0, [1.0; 3]).merged(Mesh::plane(2.0, [1.0; 3]), Vec3::Y);
        assert_eq!(merged.vertices.len(), 12);
        assert!(merged.vertices[6..].iter().all(|v| v.position[1] == 1.0));
    }
}

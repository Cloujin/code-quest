use std::collections::HashSet;

pub use winit::keyboard::KeyCode as Key;

#[derive(Default)]
pub struct Input {
    held: HashSet<Key>,
}

impl Input {
    pub fn is_down(&self, key: Key) -> bool {
        self.held.contains(&key)
    }

    pub fn axis(&self, negative: Key, positive: Key) -> f32 {
        f32::from(u8::from(self.is_down(positive))) - f32::from(u8::from(self.is_down(negative)))
    }

    pub(crate) fn set(&mut self, key: Key, down: bool) {
        if down {
            self.held.insert(key);
        } else {
            self.held.remove(&key);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn axis_cancels_when_both_keys_are_held() {
        let mut input = Input::default();
        input.set(Key::KeyA, true);
        assert_eq!(input.axis(Key::KeyA, Key::KeyD), -1.0);
        input.set(Key::KeyD, true);
        assert_eq!(input.axis(Key::KeyA, Key::KeyD), 0.0);
        input.set(Key::KeyA, false);
        assert_eq!(input.axis(Key::KeyA, Key::KeyD), 1.0);
    }
}

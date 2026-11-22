use std::sync::Arc;
use std::time::Instant;

use winit::application::ApplicationHandler;
use winit::event::{ElementState, WindowEvent};
use winit::event_loop::{ActiveEventLoop, EventLoop};
use winit::keyboard::PhysicalKey;
use winit::window::{Window, WindowId};

use crate::renderer::Renderer;
use crate::{Input, Scene};

const LONGEST_FRAME_SECONDS: f32 = 0.1;

pub trait Game {
    fn setup(&mut self, scene: &mut Scene);
    fn update(&mut self, scene: &mut Scene, input: &Input, seconds: f32);
}

struct Running {
    window: Arc<Window>,
    renderer: Renderer,
    scene: Scene,
    input: Input,
    last_frame: Instant,
}

struct App<G: Game> {
    title: String,
    game: G,
    running: Option<Running>,
}

pub fn run(title: &str, game: impl Game) {
    let event_loop = EventLoop::new().expect("an event loop");
    let mut app = App {
        title: title.to_owned(),
        game,
        running: None,
    };
    event_loop.run_app(&mut app).expect("the event loop to run");
}

impl<G: Game> ApplicationHandler for App<G> {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) {
        if self.running.is_some() {
            return;
        }
        let attributes = Window::default_attributes().with_title(&self.title);
        let window = Arc::new(event_loop.create_window(attributes).expect("a window"));
        let renderer = pollster::block_on(Renderer::new(window.clone()));
        let mut scene = Scene::default();
        self.game.setup(&mut scene);
        self.running = Some(Running {
            window,
            renderer,
            scene,
            input: Input::default(),
            last_frame: Instant::now(),
        });
    }

    fn window_event(&mut self, event_loop: &ActiveEventLoop, _: WindowId, event: WindowEvent) {
        let Some(running) = self.running.as_mut() else {
            return;
        };
        match event {
            WindowEvent::CloseRequested => event_loop.exit(),
            WindowEvent::Resized(size) => running.renderer.resize(size.width, size.height),
            WindowEvent::KeyboardInput { event, .. } => {
                if let PhysicalKey::Code(key) = event.physical_key {
                    running.input.set(key, event.state == ElementState::Pressed);
                }
            }
            WindowEvent::RedrawRequested => {
                let now = Instant::now();
                let seconds = (now - running.last_frame)
                    .as_secs_f32()
                    .min(LONGEST_FRAME_SECONDS);
                running.last_frame = now;
                self.game
                    .update(&mut running.scene, &running.input, seconds);
                running.renderer.render(&running.scene);
            }
            _ => {}
        }
    }

    fn about_to_wait(&mut self, _: &ActiveEventLoop) {
        if let Some(running) = &self.running {
            running.window.request_redraw();
        }
    }
}

use std::process::{Command, Child};
use std::sync::Mutex;
use tauri::Manager;

// Global state to hold the backend process
struct BackendState {
    process: Option<Child>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Start the backend server
      let backend_process = start_backend_server();
      app.manage(Mutex::new(BackendState {
          process: backend_process,
      }));

      Ok(())
    })
    .on_window_event(|window, event| {
      if let tauri::WindowEvent::Destroyed = event {
        // Kill backend process when window closes
        if let Ok(mut guard) = window.state::<Mutex<BackendState>>().lock() {
          if let Some(mut child) = guard.process.take() {
            let _ = child.kill();
          }
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn start_backend_server() -> Option<Child> {
    // In development, use the project's server directory
    // In production, use the bundled resources
    let server_path = if cfg!(debug_assertions) {
        // Development mode - use project directory
        let exe_dir = std::env::current_exe().ok()?;
        let app_dir = exe_dir.parent()?.parent()?.parent()?.parent()?;
        app_dir.join("server").join("app.cjs")
    } else {
        // Production mode - use bundled resources
        let exe_dir = std::env::current_exe().ok()?;
        let resources_dir = exe_dir.parent()?.parent()?.join("Resources");
        resources_dir.join("server").join("app.cjs")
    };

    println!("Starting backend server from: {:?}", server_path);

    // Start the Node.js backend server
    Command::new("node")
        .arg(server_path)
        .spawn()
        .ok()
}

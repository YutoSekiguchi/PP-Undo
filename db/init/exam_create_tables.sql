CREATE DATABASE IF NOT EXISTS ppundo_db;

USE ppundo_db;

-- 実験ユーザ
CREATE TABLE IF NOT EXISTS exam_users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ノートをしまうフォルダ
CREATE TABLE IF NOT EXISTS note_folders (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  name TEXT NOT NULL,
  parent_nfid INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ノート
CREATE TABLE IF NOT EXISTS notes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nfid INT NOT NULL,
  uid INT NOT NULL,
  title TEXT NOT NULL,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  note_image LONGTEXT NOT NULL,
  stroke_data JSON NOT NULL,
  avg_pressure FLOAT NOT NULL,
  avg_pressure_list TEXT NOT NULL,
  all_avg_pressure_list TEXT NOT NULL,
  is_show_stroke_list TEXT NOT NULL,
  all_stroke_count INT NOT NULL,
  stroke_count INT NOT NULL,
  undo_count INT NOT NULL,
  redo_count INT NOT NULL,
  log_redo_count INT NOT NULL,
  ppundo_count INT NOT NULL,
  slider_value FLOAT NOT NULL,
  background_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ストローク
CREATE TABLE IF NOT EXISTS strokes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  stroke_data JSON NOT NULL,
  avg_pressure FLOAT NOT NULL,
  point_data_list JSON NOT NULL,
  transform_pressure FLOAT NOT NULL,
  pressure_list TEXT NOT NULL,
  time FLOAT,
  start_time FLOAT,
  end_time FLOAT,
  mode TEXT NOT NULL,
  save INT NOT NULL,
  group_num INT,
  is_gesture INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- undoの回数
CREATE TABLE IF NOT EXISTS undo_counts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  before_undo_note_image LONGTEXT NOT NULL,
  before_undo_stroke_data JSON NOT NULL,
  after_undo_note_image LONGTEXT NOT NULL,
  after_undo_stroke_data JSON NOT NULL,
  left_stroke_count INT NOT NULL,
  now FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- redoの回数
CREATE TABLE IF NOT EXISTS redo_counts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  before_redo_note_image LONGTEXT NOT NULL,
  before_redo_stroke_data LONGTEXT NOT NULL,
  after_redo_note_image LONGTEXT NOT NULL,
  after_redo_stroke_data LONGTEXT NOT NULL,
  left_stroke_count INT NOT NULL,
  now FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 試験用ログ
CREATE TABLE IF NOT EXISTS logs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  stroke_data JSON NOT NULL,
  log_image LONGTEXT NOT NULL,
  pressure_list TEXT NOT NULL,
  avg_pressure_list TEXT NOT NULL,
  save INT NOT NULL,
  slider_value FLOAT NOT NULL,
  before_log_redo_slider_value FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ディスプレイ用ログ
CREATE TABLE IF NOT EXISTS client_logs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nid INT NOT NULL,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- logRedoの回数
CREATE TABLE IF NOT EXISTS log_redo_counts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  before_log_redo_note_image LONGTEXT NOT NULL,
  before_log_redo_stroke_data JSON NOT NULL,
  after_log_redo_note_image LONGTEXT NOT NULL,
  after_log_redo_stroke_data JSON NOT NULL,
  before_log_redo_stroke_count INT NOT NULL,
  after_log_redo_stroke_count INT NOT NULL,
  now FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- log見た回数
CREATE TABLE IF NOT EXISTS watch_logs_counts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  log_count INT NOT NULL,
  watch_time FLOAT NOT NULL,
  now FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ppundoの回数
CREATE TABLE IF NOT EXISTS pp_undo_counts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  after_ppundo_stroke_data JSON NOT NULL,
  after_ppundo_image_data LONGTEXT NOT NULL,
  before_ppundo_stroke_count INT NOT NULL,
  after_ppundo_stroke_count INT NOT NULL,
  now FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 選択したストロークをまとめて削除した回数
CREATE TABLE IF NOT EXISTS erase_selected_objects_counts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  nid INT NOT NULL,
  before_erase_selected_objects_note_image LONGTEXT NOT NULL,
  before_erase_selected_objects_stroke_data JSON NOT NULL,
  after_erase_selected_objects_note_image LONGTEXT NOT NULL,
  after_erase_selected_objects_stroke_data JSON NOT NULL,
  before_erase_selected_objects_stroke_count INT NOT NULL,
  after_erase_selected_objects_stroke_count INT NOT NULL,
  now FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 消しゴム使ったタイミング
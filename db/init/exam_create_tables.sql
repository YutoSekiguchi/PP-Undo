CREATE DATABASE IF NOT EXISTS ppundo_db;

USE ppundo_db;

CREATE TABLE IF NOT EXISTS exam_users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS note_folders (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nfid INT NOT NULL,
  uid INT NOT NULL,
  title TEXT NOT NULL,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  note_image LONGTEXT NOT NULL,
  stroke_data LONGTEXT NOT NULL,
  avg_pressure FLOAT NOT NULL,
  avg_pressure_list TEXT NOT NULL,
  is_show_stroke_list TEXT NOT NULL,
  slider_value FLOAT NOT NULL,
  background_image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- undoの回数
-- redoの回数
-- logRedoの回数
-- log見た回数
-- ppundoの回数
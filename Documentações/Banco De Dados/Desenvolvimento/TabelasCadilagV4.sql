-- MySQL Script generated by MySQL Workbench
-- Dom 22 Nov 2015 22:12:08 BRST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema Cadilag
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `Cadilag` ;

-- -----------------------------------------------------
-- Schema Cadilag
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Cadilag` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `Cadilag` ;

-- -----------------------------------------------------
-- Table `Cadilag`.`Usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Usuario` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Usuario` (
  `usu_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `usu_fname` VARCHAR(100) NULL COMMENT '',
  `email` VARCHAR(45) NOT NULL COMMENT '',
  `senha` VARCHAR(45) BINARY NOT NULL COMMENT '',
  `usu_lname` VARCHAR(45) NULL COMMENT '',
  `usu_nickname` VARCHAR(45) NULL COMMENT '',
  `last_login` DATE NULL COMMENT '',
  PRIMARY KEY (`usu_id`)  COMMENT '',
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Professor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Professor` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Professor` (
  `prof_id` INT NOT NULL COMMENT '',
  PRIMARY KEY (`prof_id`)  COMMENT '',
  INDEX `fk_Professor_Usuario1_idx` (`prof_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Professor_Usuario1`
    FOREIGN KEY (`prof_id`)
    REFERENCES `Cadilag`.`Usuario` (`usu_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Instituicao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Instituicao` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Instituicao` (
  `inst_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `inst_nome` VARCHAR(100) NOT NULL COMMENT '',
  `inst_uf` VARCHAR(2) NOT NULL COMMENT '',
  PRIMARY KEY (`inst_id`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Curso`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Curso` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Curso` (
  `cur_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `cur_nome` VARCHAR(45) NOT NULL COMMENT '',
  `cur_sigla` VARCHAR(5) NOT NULL COMMENT '',
  `inst_id` INT NOT NULL COMMENT '',
  PRIMARY KEY (`cur_id`)  COMMENT '',
  INDEX `fk_Curso_Instituicao1_idx` (`inst_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Curso_Instituicao1`
    FOREIGN KEY (`inst_id`)
    REFERENCES `Cadilag`.`Instituicao` (`inst_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Disciplina`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Disciplina` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Disciplina` (
  `disc_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `disc_nome` VARCHAR(45) NOT NULL COMMENT '',
  `cur_id` INT NOT NULL COMMENT '',
  PRIMARY KEY (`disc_id`)  COMMENT '',
  INDEX `fk_Disciplina_Curso1_idx` (`cur_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Disciplina_Curso1`
    FOREIGN KEY (`cur_id`)
    REFERENCES `Cadilag`.`Curso` (`cur_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Turma`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Turma` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Turma` (
  `tur_ano` INT NOT NULL COMMENT '',
  `tur_semestre` INT NOT NULL COMMENT '',
  `prof_id` INT NULL COMMENT '',
  `idTurma` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `disc_id` INT NULL COMMENT '',
  `tur_descricao` VARCHAR(45) NOT NULL COMMENT '',
  INDEX `fk_Turma_Professor1_idx` (`prof_id` ASC)  COMMENT '',
  PRIMARY KEY (`idTurma`)  COMMENT '',
  INDEX `fk_Turma_Disciplina1_idx` (`disc_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Turma_Professor1`
    FOREIGN KEY (`prof_id`)
    REFERENCES `Cadilag`.`Professor` (`prof_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Turma_Disciplina1`
    FOREIGN KEY (`disc_id`)
    REFERENCES `Cadilag`.`Disciplina` (`disc_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Aluno`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Aluno` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Aluno` (
  `alu_id` INT NOT NULL COMMENT '',
  `idTurma` INT NULL COMMENT '',
  INDEX `fk_Aluno_Usuario1_idx` (`alu_id` ASC)  COMMENT '',
  UNIQUE INDEX `alu_id_UNIQUE` (`alu_id` ASC)  COMMENT '',
  PRIMARY KEY (`alu_id`)  COMMENT '',
  INDEX `fk_Aluno_Turma1_idx` (`idTurma` ASC)  COMMENT '',
  CONSTRAINT `fk_Aluno_Usuario1`
    FOREIGN KEY (`alu_id`)
    REFERENCES `Cadilag`.`Usuario` (`usu_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Aluno_Turma1`
    FOREIGN KEY (`idTurma`)
    REFERENCES `Cadilag`.`Turma` (`idTurma`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Tipo_Permissao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Tipo_Permissao` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Tipo_Permissao` (
  `tper_nome` VARCHAR(45) NOT NULL COMMENT '',
  `tper_value` INT NOT NULL COMMENT '',
  PRIMARY KEY (`tper_value`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Estrutura_De_Dado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Estrutura_De_Dado` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Estrutura_De_Dado` (
  `ed_id` INT NOT NULL COMMENT '',
  `ed_nome` VARCHAR(45) NOT NULL COMMENT '',
  PRIMARY KEY (`ed_id`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Permissoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Permissoes` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Permissoes` (
  `ed_id` INT NOT NULL COMMENT '',
  `permisao_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `Turma_idTurma` INT NOT NULL COMMENT '',
  `Turma_Permissoes_permisao_id` INT NOT NULL COMMENT '',
  INDEX `fk_Grupo_has_Estrutura_De_Dado_Estrutura_De_Dado1_idx` (`ed_id` ASC)  COMMENT '',
  PRIMARY KEY (`permisao_id`)  COMMENT '',
  INDEX `fk_Permissoes_Turma1_idx` (`Turma_idTurma` ASC, `Turma_Permissoes_permisao_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Grupo_has_Estrutura_De_Dado_Estrutura_De_Dado1`
    FOREIGN KEY (`ed_id`)
    REFERENCES `Cadilag`.`Estrutura_De_Dado` (`ed_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Permissoes_Turma1`
    FOREIGN KEY (`Turma_idTurma`)
    REFERENCES `Cadilag`.`Turma` (`idTurma`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Atividade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Atividade` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Atividade` (
  `atv_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `atv_data_limite` DATE NOT NULL COMMENT '',
  `idTurma` INT NULL COMMENT '',
  `atv_titulo` VARCHAR(45) NOT NULL COMMENT '',
  `atv_texto` LONGTEXT NOT NULL COMMENT '',
  PRIMARY KEY (`atv_id`)  COMMENT '',
  INDEX `fk_Atividade_Turma1_idx` (`idTurma` ASC)  COMMENT '',
  CONSTRAINT `fk_Atividade_Turma1`
    FOREIGN KEY (`idTurma`)
    REFERENCES `Cadilag`.`Turma` (`idTurma`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Arquivo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Arquivo` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Arquivo` (
  `arq_nome` VARCHAR(45) NOT NULL COMMENT '',
  `arq_extensao` VARCHAR(5) NOT NULL COMMENT '',
  `arq_disponivel` TINYINT(1) NOT NULL COMMENT '',
  `arq_id` INT NOT NULL COMMENT '',
  `Usuario_usu_id` INT NULL COMMENT '',
  `Path_arquivo` VARCHAR(100) NULL COMMENT '',
  INDEX `fk_Arquivo_Usuario1_idx` (`Usuario_usu_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Arquivo_Usuario1`
    FOREIGN KEY (`Usuario_usu_id`)
    REFERENCES `Cadilag`.`Usuario` (`usu_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Topico`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Topico` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Topico` (
  `top_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `top_assunto` VARCHAR(100) NOT NULL COMMENT '',
  `usu_id` INT NULL COMMENT '',
  `ast_id` INT NOT NULL COMMENT '',
  `topico_texto` LONGTEXT NOT NULL COMMENT '',
  PRIMARY KEY (`top_id`)  COMMENT '',
  INDEX `fk_Topico_Usuario1_idx` (`usu_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Topico_Usuario1`
    FOREIGN KEY (`usu_id`)
    REFERENCES `Cadilag`.`Usuario` (`usu_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Resposta`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Resposta` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Resposta` (
  `resp_id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `resp_texto` LONGTEXT NOT NULL COMMENT '',
  `top_id` INT NULL COMMENT '',
  `usu_id` INT NULL COMMENT '',
  PRIMARY KEY (`resp_id`)  COMMENT '',
  INDEX `fk_Resposta_Topico2_idx` (`top_id` ASC)  COMMENT '',
  INDEX `fk_Resposta_Usuario1_idx` (`usu_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Resposta_Topico2`
    FOREIGN KEY (`top_id`)
    REFERENCES `Cadilag`.`Topico` (`top_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Resposta_Usuario1`
    FOREIGN KEY (`usu_id`)
    REFERENCES `Cadilag`.`Usuario` (`usu_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Configuracoes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Configuracoes` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Configuracoes` (
  `Usuario_usu_id` INT NOT NULL COMMENT '',
  `Path_imguser` VARCHAR(100) NULL COMMENT '',
  `Path_imgcover` VARCHAR(100) NULL COMMENT '',
  `cssImgCover` VARCHAR(45) NULL COMMENT '',
  INDEX `fk_Configuracoes_Usuario1_idx` (`Usuario_usu_id` ASC)  COMMENT '',
  PRIMARY KEY (`Usuario_usu_id`)  COMMENT '',
  CONSTRAINT `fk_Configuracoes_Usuario1`
    FOREIGN KEY (`Usuario_usu_id`)
    REFERENCES `Cadilag`.`Usuario` (`usu_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`Permissoes_has_Tipo_Permissao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`Permissoes_has_Tipo_Permissao` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`Permissoes_has_Tipo_Permissao` (
  `Permissoes_permisao_id` INT NOT NULL COMMENT '',
  `Tipo_Permissao_tper_value` INT NOT NULL COMMENT '',
  PRIMARY KEY (`Permissoes_permisao_id`, `Tipo_Permissao_tper_value`)  COMMENT '',
  INDEX `fk_Permissoes_has_Tipo_Permissao_Tipo_Permissao1_idx` (`Tipo_Permissao_tper_value` ASC)  COMMENT '',
  INDEX `fk_Permissoes_has_Tipo_Permissao_Permissoes1_idx` (`Permissoes_permisao_id` ASC)  COMMENT '',
  CONSTRAINT `fk_Permissoes_has_Tipo_Permissao_Permissoes1`
    FOREIGN KEY (`Permissoes_permisao_id`)
    REFERENCES `Cadilag`.`Permissoes` (`permisao_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Permissoes_has_Tipo_Permissao_Tipo_Permissao1`
    FOREIGN KEY (`Tipo_Permissao_tper_value`)
    REFERENCES `Cadilag`.`Tipo_Permissao` (`tper_value`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Cadilag`.`EntradaProgramada`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Cadilag`.`EntradaProgramada` ;

CREATE TABLE IF NOT EXISTS `Cadilag`.`EntradaProgramada` (
  `idEntradaProgramada` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `Usuario_usu_id` INT NOT NULL COMMENT '',
  `Estrutura_De_Dado_ed_id` INT NOT NULL COMMENT '',
  `path_entrada` VARCHAR(100) NULL COMMENT '',
  PRIMARY KEY (`idEntradaProgramada`)  COMMENT '',
  INDEX `fk_EntradaProgramada_Usuario1_idx` (`Usuario_usu_id` ASC)  COMMENT '',
  INDEX `fk_EntradaProgramada_Estrutura_De_Dado1_idx` (`Estrutura_De_Dado_ed_id` ASC)  COMMENT '',
  CONSTRAINT `fk_EntradaProgramada_Usuario1`
    FOREIGN KEY (`Usuario_usu_id`)
    REFERENCES `Cadilag`.`Usuario` (`usu_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_EntradaProgramada_Estrutura_De_Dado1`
    FOREIGN KEY (`Estrutura_De_Dado_ed_id`)
    REFERENCES `Cadilag`.`Estrutura_De_Dado` (`ed_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

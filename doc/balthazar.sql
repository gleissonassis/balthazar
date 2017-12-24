-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema balthazar
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema balthazar
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `balthazar` DEFAULT CHARACTER SET utf8 ;
USE `balthazar` ;

-- -----------------------------------------------------
-- Table `balthazar`.`StopWord`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `balthazar`.`StopWord` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(255) NOT NULL,
  `language` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `balthazar`.`SystemInfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `balthazar`.`SystemInfo` (
  `id` VARCHAR(45) NOT NULL COMMENT 'The id for a system will be provided by the user and will be used as key',
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `balthazar`.`Word`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `balthazar`.`Word` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(255) NOT NULL,
  `language` VARCHAR(45) NOT NULL,
  `phonem` VARCHAR(45) NOT NULL,
  `systemInfoId` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Word_SystemInfo1_idx` (`systemInfoId` ASC),
  CONSTRAINT `fk_Word_SystemInfo1`
    FOREIGN KEY (`systemInfoId`)
    REFERENCES `balthazar`.`SystemInfo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `balthazar`.`Document`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `balthazar`.`Document` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `systemInfoId` VARCHAR(45) NOT NULL,
  `language` VARCHAR(45) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `group` VARCHAR(45) NOT NULL COMMENT 'This field is used to group documents. A group can be a system module or something used in the system to separate group of documents.',
  `reference` VARCHAR(45) NOT NULL COMMENT 'Reference is a internal identifier inside the system and there is no relevance for Balthazar',
  `url` VARCHAR(255) NOT NULL COMMENT 'The url is a reference inside the system and there is no relevance for Balthazar',
  `contents` LONGTEXT NOT NULL COMMENT 'Even though the document is indexed, its content will be stored to help the user interface create some highlights to make simple the user identify the tags on the text.',
  `hash` CHAR(32) NOT NULL COMMENT 'The hash of a document is used to verify if the content has changed. Internally Balthazar computes the hash and stores the value.',
  `createdAt` DATETIME NOT NULL COMMENT 'This field is a reference inside the system and there is no reference when the record was saved in the Balthazar',
  `modifiedAt` DATETIME NULL COMMENT 'This field is a reference inside the system and there is no reference when the record was modified in the Balthazar',
  `createdBy` VARCHAR(255) NOT NULL COMMENT 'This field is a reference inside the system and there is no reference who saved in the Balthazar',
  `modifiedBy` VARCHAR(255) NULL COMMENT 'This field is a reference inside the system and there is no reference who modified in the Balthazar',
  PRIMARY KEY (`id`),
  INDEX `fk_Document_SystemInfo1_idx` (`systemInfoId` ASC),
  INDEX `idx_AllByRefUrl` (`systemInfoId` ASC, `reference` ASC, `url` ASC),
  INDEX `idx_AllByRefUrlHash` (`systemInfoId` ASC, `reference` ASC, `url` ASC, `hash` ASC),
  INDEX `idx_AllByGroup` (`systemInfoId` ASC, `group` ASC),
  UNIQUE INDEX `uq_Document_GroupReference` (`systemInfoId` ASC, `group` ASC, `reference` ASC),
  INDEX `idx_ByGroupReference` (`systemInfoId` ASC, `group` ASC, `reference` ASC),
  CONSTRAINT `fk_Document_SystemInfo1`
    FOREIGN KEY (`systemInfoId`)
    REFERENCES `balthazar`.`SystemInfo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `balthazar`.`Index`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `balthazar`.`Index` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `wordId` INT NOT NULL,
  `documentId` INT NOT NULL,
  `position` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Index_Word_idx` (`wordId` ASC),
  INDEX `fk_Index_Document1_idx` (`documentId` ASC),
  CONSTRAINT `fk_Index_Word`
    FOREIGN KEY (`wordId`)
    REFERENCES `balthazar`.`Word` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Index_Document1`
    FOREIGN KEY (`documentId`)
    REFERENCES `balthazar`.`Document` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `balthazar` ;

-- -----------------------------------------------------
-- function phonembr_normalize
-- -----------------------------------------------------

DELIMITER $$
USE `balthazar`$$
create function phonembr_normalize(str varchar(255))
returns varchar(255)
begin
    declare pos int;
    declare chars_special varchar(255);
    declare chars_normal varchar(255);    
     
    set chars_special = 'ÁÀÃÂÉÊÍÓÔÕÚÜ';
    set chars_normal = 'AAAAEEIOOOUU';    
     
    set str = upper(str);    
    set pos = length(chars_normal);    
    while pos > 0 do
        set str = replace(str, substring(chars_special, pos, 1), substring(chars_normal, pos, 1));
        set pos = pos-1;
    end while;        
     
    set str = trim(str);
    while str regexp ' {2,}' do 
        set str = replace(str, '  ', ' ');
    end while;    
         
    set pos = length(str);
    while pos > 0 do 
        if substring(str, pos, 1) regexp '[^A-Z0-9Ç@._ +-]+' then
            set str = concat(substring(str, 1, pos-1), substring(str, pos+1));
        end if;
        set pos = pos-1;
    end while;        
 
    return str;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function phonembr
-- -----------------------------------------------------

DELIMITER $$
USE `balthazar`$$
create function phonembr(str varchar(255))
returns varchar(255)
begin
    declare pos int;
    declare break tinyint;
    declare chars_s varchar(255);
    declare chars_r varchar(255);
         
    set str = phonembr_normalize(str);            
    set chars_s = 'BL,BR,CA,CE,CI,CO,CU,CK,Ç,CH,CS,CT,GE,GI,GM,GL,GR,L,N,MD,MG,MJ,PH,PR,Q,RG,RS,RT,RM,RJ,ST,TR,TL,TS,W,X,Y,Z';
    set chars_r = 'B,B,K,S,S,K,K,K,S,S,S,T,J,J,M,G,G,R,M,M,G,J,F,P,K,G,S,T,SM,J,T,T,T,S,V,S,I,S';    
     
    set break = 0;
    while not break do 
        set str = replace(str, substring_index(chars_s, ',', 1), substring_index(chars_r, ',', 1));    
        if not locate(',', chars_s) then
            set break = 1;
        else
            set chars_s = substring(chars_s, locate(',', chars_s)+1);
            set chars_r = substring(chars_r, locate(',', chars_r)+1);
        end if;    
    end while;                                                                        
     
    if str regexp '[A-Z]+[MRS] ' then
        set str = replace(str, 'M ', ' ');
        set str = replace(str, 'R ', ' ');
        set str = replace(str, 'S ', ' ');
    end if;            
    if str regexp '[A-Z]+[MRS]$' then
        set str = substr(str, 1, length(str)-1);
    end if;
     
    set str = replace(str, 'A', '');
    set str = replace(str, 'E', '');
    set str = replace(str, 'I', '');    
    set str = replace(str, 'O', '');
    set str = replace(str, 'U', '');
    set str = replace(str, 'H', '');    
     
    set pos = length(str);
    while pos > 0 do 
        if substr(str, pos, 1) = substr(str, pos-1, 1) then
            set str = concat(substr(str, 1, pos-1), substr(str, pos+1));
        end if;
        set pos = pos-1;
    end while;   
 
   return str;
end$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

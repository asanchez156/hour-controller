CREATE TABLE IF NOT EXISTS `EMPLEADO_EMPRESA` (
  `ID_EMPLEADO` int(11) NOT NULL,
  `ID_EMPRESA` int(11) NOT NULL,
  PRIMARY KEY (`ID_EMPLEADO`,`ID_EMPRESA`),
  CONSTRAINT EMP_EMP_FK FOREIGN KEY (`ID_EMPLEADO`) REFERENCES EMPLEADO(ID_EMPLEADO) ON DELETE CASCADE,
  CONSTRAINT EMP_E_FK FOREIGN KEY (`ID_EMPRESA`) REFERENCES EMPRESA(ID_EMPRESA) ON DELETE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `EMPLEADO` DROP `ID_EMPRESA`;

ALTER TABLE `EMPLEADO_EMPRESA` ADD COLUMN `CREATE_DATE` timestamp NOT NULL DEFAULT '2017-01-01 00:00:00';
ALTER TABLE `EMPLEADO_EMPRESA` ADD COLUMN `MODIFY_DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

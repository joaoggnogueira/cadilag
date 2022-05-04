-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 01-Out-2017 às 23:55
-- Versão do servidor: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cadilag`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `aluno`
--

CREATE TABLE `aluno` (
  `alu_id` int(11) NOT NULL,
  `idTurma` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `arquivo`
--

CREATE TABLE `arquivo` (
  `id_file` int(11) NOT NULL,
  `arq_id` int(11) NOT NULL,
  `idusuario` int(11) DEFAULT NULL,
  `idatividade` int(11) NOT NULL,
  `data` date DEFAULT NULL,
  `hora` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `atividade`
--

CREATE TABLE `atividade` (
  `atv_id` int(11) NOT NULL,
  `atv_data_limite` date NOT NULL,
  `idTurma` int(11) DEFAULT NULL,
  `atv_titulo` varchar(45) NOT NULL,
  `atv_texto` longtext NOT NULL,
  `atv_data` date DEFAULT NULL,
  `atv_hora` time DEFAULT NULL,
  `atv_tipo` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `codigo`
--

CREATE TABLE `codigo` (
  `id` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idEstrutura` int(11) NOT NULL,
  `titulo` varchar(32) NOT NULL,
  `linguagem` varchar(32) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `jsonAdd` text NOT NULL,
  `jsonRem` text NOT NULL,
  `jsonSearch` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `curso`
--

CREATE TABLE `curso` (
  `cur_id` int(11) NOT NULL,
  `cur_nome` varchar(100) NOT NULL,
  `cur_sigla` varchar(5) NOT NULL,
  `inst_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `disciplina`
--

CREATE TABLE `disciplina` (
  `disc_id` int(11) NOT NULL,
  `disc_nome` varchar(100) NOT NULL,
  `cur_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `entradaprogramada`
--

CREATE TABLE `entradaprogramada` (
  `idEntradaProgramada` int(11) NOT NULL,
  `Usuario_usu_id` int(11) NOT NULL,
  `Estrutura_De_Dado_ed_id` int(11) NOT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `totalep` int(3) NOT NULL,
  `json` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estrutura_de_dado`
--

CREATE TABLE `estrutura_de_dado` (
  `ed_id` int(11) NOT NULL,
  `ed_nome` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `estrutura_de_dado`
--

INSERT INTO `estrutura_de_dado` (`ed_id`, `ed_nome`) VALUES
(1, 'Lista Encadeada Ordenada Simples'),
(2, 'Lista Encadeada Ordenada Estática'),
(3, 'Lista Encadeada Ordenada Dupla'),
(4, 'Lista Encadeada Não Ordenada Simples'),
(5, 'Lista Encadeada Não Ordenada Dupla'),
(6, 'Lista Cruzada'),
(7, 'Fila Estática Simples'),
(8, 'Fila Dinâmica Com Prioridade'),
(9, 'Fila Dinâmica Sem Prioridade'),
(10, 'Fila Circular'),
(11, 'Pilha Estática Normal'),
(12, 'Pilha Estática Múltipla'),
(13, 'Pilha Dinâmica Simples'),
(14, 'Hashing sem tratamento'),
(15, 'Hashing com tratamento'),
(16, 'Árvore AVL'),
(17, 'Árvore B'),
(18, 'Árvore B+'),
(19, 'Árvore Rubro-Negra'),
(20, 'Árvore Binaria'),
(21, 'Árvore Trie'),
(22, 'Árvore Patricia');

-- --------------------------------------------------------

--
-- Estrutura da tabela `evento`
--

CREATE TABLE `evento` (
  `id` int(11) NOT NULL,
  `titulo` varchar(45) NOT NULL,
  `data` date NOT NULL,
  `idTurma` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `file`
--

CREATE TABLE `file` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `content` mediumblob NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `instituicao`
--

CREATE TABLE `instituicao` (
  `inst_id` int(11) NOT NULL,
  `inst_nome` varchar(100) NOT NULL,
  `inst_uf` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `link`
--

CREATE TABLE `link` (
  `path` longtext NOT NULL,
  `nome` varchar(45) NOT NULL,
  `external_image` text,
  `external_title` text,
  `link_id` int(11) NOT NULL,
  `Turma_idTurma` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `materialdidatico`
--

CREATE TABLE `materialdidatico` (
  `id_file` int(11) NOT NULL,
  `idMaterialDidatico` int(11) NOT NULL,
  `rotulo` varchar(45) DEFAULT NULL,
  `detalhes` longtext,
  `data` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `Turma_idTurma` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `permissoes`
--

CREATE TABLE `permissoes` (
  `ed_id` int(11) NOT NULL,
  `pseudo_add` tinyint(1) DEFAULT NULL,
  `Turma_idTurma` int(11) NOT NULL,
  `pseudo_rem` tinyint(1) DEFAULT NULL,
  `pseudo_search` tinyint(1) DEFAULT NULL,
  `idpermissao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `professor`
--

CREATE TABLE `professor` (
  `prof_id` int(11) NOT NULL,
  `prof_confirmado` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `report`
--

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `id_estrutura` int(11) NOT NULL,
  `text` text NOT NULL,
  `history` text NOT NULL COMMENT 'armazena entrada de teste usada',
  `datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='armazena feedbacks de erros';

-- --------------------------------------------------------

--
-- Estrutura da tabela `resposta`
--

CREATE TABLE `resposta` (
  `resp_id` int(11) NOT NULL,
  `resp_texto` longtext NOT NULL,
  `top_id` int(11) DEFAULT NULL,
  `usu_id` int(11) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `hora` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `solicitacao`
--

CREATE TABLE `solicitacao` (
  `Aluno_alu_id` int(11) NOT NULL,
  `Turma_idTurma` int(11) NOT NULL,
  `idsolicitacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `topico`
--

CREATE TABLE `topico` (
  `top_id` int(11) NOT NULL,
  `top_assunto` varchar(100) NOT NULL,
  `usu_id` int(11) DEFAULT NULL,
  `topico_texto` longtext NOT NULL,
  `data` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `Turma_idTurma` int(11) DEFAULT NULL,
  `visible_only_by_class` tinyint(1) DEFAULT NULL,
  `anonimo` tinyint(1) DEFAULT NULL,
  `report` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `turma`
--

CREATE TABLE `turma` (
  `tur_ano` int(11) NOT NULL,
  `tur_semestre` int(11) NOT NULL,
  `prof_id` int(11) DEFAULT NULL,
  `idTurma` int(11) NOT NULL,
  `disc_id` int(11) DEFAULT NULL,
  `status` longtext,
  `id_file_plano_de_ensino` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `usu_id` int(11) NOT NULL,
  `usu_fname` varchar(40) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `usu_lname` varchar(40) DEFAULT NULL,
  `usu_nickname` varchar(40) DEFAULT NULL,
  `Path_imguser` varchar(100) DEFAULT NULL,
  `dia_cadastro` date DEFAULT NULL,
  `facebook_id_user` varchar(100) DEFAULT NULL,
  `facebook_email` varchar(100) DEFAULT NULL,
  `google_id_user` varchar(100) DEFAULT NULL,
  `google_email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `voto`
--

CREATE TABLE `voto` (
  `Usuario_usu_id` int(11) NOT NULL,
  `Resposta_resp_id` int(11) NOT NULL,
  `valor` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`alu_id`),
  ADD UNIQUE KEY `alu_id_UNIQUE` (`alu_id`),
  ADD KEY `fk_Aluno_Usuario1_idx` (`alu_id`),
  ADD KEY `fk_Aluno_Turma1_idx` (`idTurma`);

--
-- Indexes for table `arquivo`
--
ALTER TABLE `arquivo`
  ADD PRIMARY KEY (`arq_id`),
  ADD KEY `fk_Arquivo_Usuario1_idx` (`idusuario`),
  ADD KEY `fk_Arquivo_Atividade1_idx` (`idatividade`),
  ADD KEY `id_file` (`id_file`);

--
-- Indexes for table `atividade`
--
ALTER TABLE `atividade`
  ADD PRIMARY KEY (`atv_id`),
  ADD KEY `fk_Atividade_Turma1_idx` (`idTurma`);

--
-- Indexes for table `codigo`
--
ALTER TABLE `codigo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idEstrutura` (`idEstrutura`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`cur_id`),
  ADD KEY `fk_Curso_Instituicao1_idx` (`inst_id`);

--
-- Indexes for table `disciplina`
--
ALTER TABLE `disciplina`
  ADD PRIMARY KEY (`disc_id`),
  ADD KEY `fk_Disciplina_Curso1_idx` (`cur_id`);

--
-- Indexes for table `entradaprogramada`
--
ALTER TABLE `entradaprogramada`
  ADD PRIMARY KEY (`idEntradaProgramada`),
  ADD KEY `fk_EntradaProgramada_Usuario1_idx` (`Usuario_usu_id`),
  ADD KEY `fk_EntradaProgramada_Estrutura_De_Dado1_idx` (`Estrutura_De_Dado_ed_id`);

--
-- Indexes for table `estrutura_de_dado`
--
ALTER TABLE `estrutura_de_dado`
  ADD PRIMARY KEY (`ed_id`);

--
-- Indexes for table `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idTurma` (`idTurma`),
  ADD KEY `idTurma_2` (`idTurma`),
  ADD KEY `idTurma_3` (`idTurma`);

--
-- Indexes for table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `instituicao`
--
ALTER TABLE `instituicao`
  ADD PRIMARY KEY (`inst_id`);

--
-- Indexes for table `link`
--
ALTER TABLE `link`
  ADD PRIMARY KEY (`link_id`),
  ADD KEY `fk_link_Turma1_idx` (`Turma_idTurma`);

--
-- Indexes for table `materialdidatico`
--
ALTER TABLE `materialdidatico`
  ADD PRIMARY KEY (`idMaterialDidatico`),
  ADD KEY `fk_MaterialDidatico_Turma1_idx` (`Turma_idTurma`);

--
-- Indexes for table `permissoes`
--
ALTER TABLE `permissoes`
  ADD PRIMARY KEY (`idpermissao`),
  ADD KEY `fk_Grupo_has_Estrutura_De_Dado_Estrutura_De_Dado1_idx` (`ed_id`),
  ADD KEY `fk_Permissoes_Turma1_idx` (`Turma_idTurma`);

--
-- Indexes for table `professor`
--
ALTER TABLE `professor`
  ADD PRIMARY KEY (`prof_id`),
  ADD KEY `fk_Professor_Usuario1_idx` (`prof_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_estrutura` (`id_estrutura`);

--
-- Indexes for table `resposta`
--
ALTER TABLE `resposta`
  ADD PRIMARY KEY (`resp_id`),
  ADD KEY `fk_Resposta_Topico2_idx` (`top_id`),
  ADD KEY `fk_Resposta_Usuario1_idx` (`usu_id`);

--
-- Indexes for table `solicitacao`
--
ALTER TABLE `solicitacao`
  ADD PRIMARY KEY (`idsolicitacao`),
  ADD KEY `fk_solicitacao_Aluno1_idx` (`Aluno_alu_id`),
  ADD KEY `fk_solicitacao_Turma1_idx` (`Turma_idTurma`);

--
-- Indexes for table `topico`
--
ALTER TABLE `topico`
  ADD PRIMARY KEY (`top_id`),
  ADD KEY `fk_Topico_Usuario1_idx` (`usu_id`),
  ADD KEY `fk_Topico_Turma1_idx` (`Turma_idTurma`);

--
-- Indexes for table `turma`
--
ALTER TABLE `turma`
  ADD PRIMARY KEY (`idTurma`),
  ADD KEY `fk_Turma_Professor1_idx` (`prof_id`),
  ADD KEY `fk_Turma_Disciplina1_idx` (`disc_id`),
  ADD KEY `idTurma` (`idTurma`),
  ADD KEY `id_file_plano_de_ensino` (`id_file_plano_de_ensino`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`usu_id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`),
  ADD UNIQUE KEY `facebook_email` (`facebook_email`),
  ADD UNIQUE KEY `facebook_id_user` (`facebook_id_user`),
  ADD UNIQUE KEY `google_id_user` (`google_id_user`),
  ADD UNIQUE KEY `google_email` (`google_email`);

--
-- Indexes for table `voto`
--
ALTER TABLE `voto`
  ADD PRIMARY KEY (`Usuario_usu_id`,`Resposta_resp_id`),
  ADD KEY `fk_Usuario_has_Resposta_Resposta1_idx` (`Resposta_resp_id`),
  ADD KEY `fk_Usuario_has_Resposta_Usuario1_idx` (`Usuario_usu_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `arquivo`
--
ALTER TABLE `arquivo`
  MODIFY `arq_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `atividade`
--
ALTER TABLE `atividade`
  MODIFY `atv_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `codigo`
--
ALTER TABLE `codigo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `curso`
--
ALTER TABLE `curso`
  MODIFY `cur_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `disciplina`
--
ALTER TABLE `disciplina`
  MODIFY `disc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `entradaprogramada`
--
ALTER TABLE `entradaprogramada`
  MODIFY `idEntradaProgramada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `evento`
--
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `file`
--
ALTER TABLE `file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `instituicao`
--
ALTER TABLE `instituicao`
  MODIFY `inst_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `link`
--
ALTER TABLE `link`
  MODIFY `link_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `materialdidatico`
--
ALTER TABLE `materialdidatico`
  MODIFY `idMaterialDidatico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `permissoes`
--
ALTER TABLE `permissoes`
  MODIFY `idpermissao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `resposta`
--
ALTER TABLE `resposta`
  MODIFY `resp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `solicitacao`
--
ALTER TABLE `solicitacao`
  MODIFY `idsolicitacao` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `topico`
--
ALTER TABLE `topico`
  MODIFY `top_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `turma`
--
ALTER TABLE `turma`
  MODIFY `idTurma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `usu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `aluno`
--
ALTER TABLE `aluno`
  ADD CONSTRAINT `fk_Aluno_Turma1` FOREIGN KEY (`idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Aluno_Usuario1` FOREIGN KEY (`alu_id`) REFERENCES `usuario` (`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `arquivo`
--
ALTER TABLE `arquivo`
  ADD CONSTRAINT `fk_Arquivo_Atividade1` FOREIGN KEY (`idatividade`) REFERENCES `atividade` (`atv_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Arquivo_Usuario1` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`usu_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Limitadores para a tabela `atividade`
--
ALTER TABLE `atividade`
  ADD CONSTRAINT `fk_Atividade_Turma1` FOREIGN KEY (`idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Limitadores para a tabela `codigo`
--
ALTER TABLE `codigo`
  ADD CONSTRAINT `UsuarioCode` FOREIGN KEY (`idUser`) REFERENCES `usuario` (`usu_id`),
  ADD CONSTRAINT `codigo_ibfk_1` FOREIGN KEY (`idEstrutura`) REFERENCES `estrutura_de_dado` (`ed_id`);

--
-- Limitadores para a tabela `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `fk_Curso_Instituicao1` FOREIGN KEY (`inst_id`) REFERENCES `instituicao` (`inst_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `disciplina`
--
ALTER TABLE `disciplina`
  ADD CONSTRAINT `fk_Disciplina_Curso1` FOREIGN KEY (`cur_id`) REFERENCES `curso` (`cur_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `entradaprogramada`
--
ALTER TABLE `entradaprogramada`
  ADD CONSTRAINT `fk_EntradaProgramada_Estrutura_De_Dado1` FOREIGN KEY (`Estrutura_De_Dado_ed_id`) REFERENCES `estrutura_de_dado` (`ed_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_EntradaProgramada_Usuario1` FOREIGN KEY (`Usuario_usu_id`) REFERENCES `usuario` (`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `link`
--
ALTER TABLE `link`
  ADD CONSTRAINT `fk_link_Turma1` FOREIGN KEY (`Turma_idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `materialdidatico`
--
ALTER TABLE `materialdidatico`
  ADD CONSTRAINT `fk_MaterialDidatico_Turma1` FOREIGN KEY (`Turma_idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `permissoes`
--
ALTER TABLE `permissoes`
  ADD CONSTRAINT `fk_Grupo_has_Estrutura_De_Dado_Estrutura_De_Dado1` FOREIGN KEY (`ed_id`) REFERENCES `estrutura_de_dado` (`ed_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Permissoes_Turma1` FOREIGN KEY (`Turma_idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `professor`
--
ALTER TABLE `professor`
  ADD CONSTRAINT `fk_Professor_Usuario1` FOREIGN KEY (`prof_id`) REFERENCES `usuario` (`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `bind_estrutura_report` FOREIGN KEY (`id_estrutura`) REFERENCES `estrutura_de_dado` (`ed_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `resposta`
--
ALTER TABLE `resposta`
  ADD CONSTRAINT `fk_Resposta_Topico2` FOREIGN KEY (`top_id`) REFERENCES `topico` (`top_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Resposta_Usuario1` FOREIGN KEY (`usu_id`) REFERENCES `usuario` (`usu_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Limitadores para a tabela `solicitacao`
--
ALTER TABLE `solicitacao`
  ADD CONSTRAINT `fk_solicitacao_Aluno1` FOREIGN KEY (`Aluno_alu_id`) REFERENCES `aluno` (`alu_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_solicitacao_Turma1` FOREIGN KEY (`Turma_idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `topico`
--
ALTER TABLE `topico`
  ADD CONSTRAINT `fk_Topico_Turma1` FOREIGN KEY (`Turma_idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Topico_Usuario1` FOREIGN KEY (`usu_id`) REFERENCES `usuario` (`usu_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Limitadores para a tabela `turma`
--
ALTER TABLE `turma`
  ADD CONSTRAINT `fk_Turma_Disciplina1` FOREIGN KEY (`disc_id`) REFERENCES `disciplina` (`disc_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Turma_Professor1` FOREIGN KEY (`prof_id`) REFERENCES `professor` (`prof_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Limitadores para a tabela `voto`
--
ALTER TABLE `voto`
  ADD CONSTRAINT `fk_Usuario_has_Resposta_Resposta1` FOREIGN KEY (`Resposta_resp_id`) REFERENCES `resposta` (`resp_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Usuario_has_Resposta_Usuario1` FOREIGN KEY (`Usuario_usu_id`) REFERENCES `usuario` (`usu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/arcetros/chacord/compare/v1.1.0...v1.2.0) (2023-04-30)


### Features

* **commands:** add AddParticipant command ([2d9fd2f](https://github.com/arcetros/chacord/commit/2d9fd2f7ac599ab8def8824fa9f89e2f3f9cb91d))
* **commands:** add BulkAddParticipants command ([ee75bbc](https://github.com/arcetros/chacord/commit/ee75bbc8a627117806cf2205313362885b1adfc9))
* **commands:** add ClearParticipants command ([8e0d8dc](https://github.com/arcetros/chacord/commit/8e0d8dcd57d9c2ed27906f594662015f1456c3ab))
* **commands:** add DeleteParticipant command ([d39d644](https://github.com/arcetros/chacord/commit/d39d644a583d7e9254a707c0550f3648a612d879))
* **commands:** add join/leave command ([8f0d032](https://github.com/arcetros/chacord/commit/8f0d0329fc27efc13057ae305cf68479fb1c50a2))
* **commands:** add RandomizeSeed command ([38c3075](https://github.com/arcetros/chacord/commit/38c3075c13aaf40c998188766666cce14cff53af))
* **commands:** define tournament is_private in desc ([8ab759a](https://github.com/arcetros/chacord/commit/8ab759a1992b4d2d1a0303b4fe44cb23c3f3cf43))


### Bug Fixes

* **AddParticipant:** add conditions ([f8e31be](https://github.com/arcetros/chacord/commit/f8e31be1df98eca1e0f2bf38560182aaf1c0c0e2))
* **commands:** add deferReply() for challonge requests ([#30](https://github.com/arcetros/chacord/issues/30)) ([bc613e1](https://github.com/arcetros/chacord/commit/bc613e1ea484d059385ba5629bc41b1e63399aec))

## 1.1.0 (2023-04-20)


### Features

* add `interactionCreate` listener & commands folder ([f3446d8](https://github.com/arcetros/chacord/commit/f3446d8dddb15b97bdbb1ab6b88223e56572ce62))
* add Challonge api wrapper ([139ded4](https://github.com/arcetros/chacord/commit/139ded45bee5f8dc9b365f665deb51856771c90c))
* add consola as logger ([c845be7](https://github.com/arcetros/chacord/commit/c845be77d8ee50366ace9920fc58011058d53a58))
* add Tournament types & allow subdomain ([bffc35f](https://github.com/arcetros/chacord/commit/bffc35f426d3aa2756ca8cd946709a1cd99fc509))
* **api:** add Matches method ([a70f95e](https://github.com/arcetros/chacord/commit/a70f95ef57ed19b129a3cb6df849f2074a404d8b))
* **api:** add Participant method ([3448e77](https://github.com/arcetros/chacord/commit/3448e777e91f13fc4963beef6a056ba1fcc42f34))
* **commands/challonge:** add `tcreate`, `tinfo, `tdestroy` commands ([2c675cf](https://github.com/arcetros/chacord/commit/2c675cf4a0feb37b4cf4ab9343bc356e44063694))
* **commands/challonge:** add `tcreate`, `tinfo`, `tdestroy` commands ([5698e44](https://github.com/arcetros/chacord/commit/5698e444d310b8d3e088cb2ba4002c0136e131ba))
* **commands/challonge:** add show tournament ([bd4104d](https://github.com/arcetros/chacord/commit/bd4104d263a45a4c80217c9a1447052c9c3000b5))
* **structures/commands:** add isTournamentManager function ([63888c3](https://github.com/arcetros/chacord/commit/63888c35f49ba1db64b4dd13f60a663480114a85))
* **Tournament:** add tournament methods ([ae82408](https://github.com/arcetros/chacord/commit/ae8240824ac5006edcc2b730f595a2fd0149b992))


### Bug Fixes

* **ci:** NPM ERR ([#12](https://github.com/arcetros/chacord/issues/12)) ([87ce885](https://github.com/arcetros/chacord/commit/87ce885a1e9048c4398347a533604f82c169303d))
* **Client:** conditional error for `422` ([c3d9f52](https://github.com/arcetros/chacord/commit/c3d9f524f2129525892a80a5451218f2e8811694))
* **deps:** update dependency consola to ^3.1.0 ([#22](https://github.com/arcetros/chacord/issues/22)) ([f79e01c](https://github.com/arcetros/chacord/commit/f79e01cbba3242cbaad86af3ab1f297c24b2647d))
* **deps:** update dependency consola to v3 ([#15](https://github.com/arcetros/chacord/issues/15)) ([d53a97e](https://github.com/arcetros/chacord/commit/d53a97e1159d92f860ecc809324bdb77351f262b))
* **deps:** update dependency discord.js to ^14.9.0 ([#8](https://github.com/arcetros/chacord/issues/8)) ([47cfc59](https://github.com/arcetros/chacord/commit/47cfc5949d3708a39d6c8ca217b88161c87e059f))
* **deps:** update dependency rimraf to v5 ([#16](https://github.com/arcetros/chacord/issues/16)) ([ddb5750](https://github.com/arcetros/chacord/commit/ddb57505cc2122b5d93dd0787918e6d4809a943d))
* **structures:** minor fixes to make things work ([ae15152](https://github.com/arcetros/chacord/commit/ae15152e006af3c9d5abc1529dac25b9db53896b))
* **utils:** remove object index for array ([ea0042a](https://github.com/arcetros/chacord/commit/ea0042a15d67ea2358fa176da2f262d87f6dd717))

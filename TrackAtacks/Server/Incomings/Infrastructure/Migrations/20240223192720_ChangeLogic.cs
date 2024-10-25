using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeLogic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Commands_Players_DestinyPlayerId",
                table: "Commands");

            migrationBuilder.DropForeignKey(
                name: "FK_Commands_Players_OriginPlayerId",
                table: "Commands");

            migrationBuilder.DropForeignKey(
                name: "FK_OldCommands_Players_DestinyPlayerId",
                table: "OldCommands");

            migrationBuilder.DropForeignKey(
                name: "FK_OldCommands_Players_OriginPlayerId",
                table: "OldCommands");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Players",
                table: "Players");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OldCommands",
                table: "OldCommands");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Commands",
                table: "Commands");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "OldCommands");

            migrationBuilder.DropColumn(
                name: "DestinyVillage",
                table: "OldCommands");

            migrationBuilder.DropColumn(
                name: "OriginVillage",
                table: "OldCommands");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Commands");

            migrationBuilder.DropColumn(
                name: "DestinyVillage",
                table: "Commands");

            migrationBuilder.DropColumn(
                name: "OriginVillage",
                table: "Commands");

            migrationBuilder.DropSequence(
                name: "CommandSequence");

            migrationBuilder.RenameColumn(
                name: "OriginPlayerId",
                table: "OldCommands",
                newName: "OriginVillageGameId");

            migrationBuilder.RenameColumn(
                name: "DestinyPlayerId",
                table: "OldCommands",
                newName: "DestinyVillageGameId");

            migrationBuilder.RenameIndex(
                name: "IX_OldCommands_OriginPlayerId",
                table: "OldCommands",
                newName: "IX_OldCommands_OriginVillageGameId");

            migrationBuilder.RenameIndex(
                name: "IX_OldCommands_DestinyPlayerId",
                table: "OldCommands",
                newName: "IX_OldCommands_DestinyVillageGameId");

            migrationBuilder.RenameColumn(
                name: "OriginPlayerId",
                table: "Commands",
                newName: "OriginVillageGameId");

            migrationBuilder.RenameColumn(
                name: "DestinyPlayerId",
                table: "Commands",
                newName: "DestinyVillageGameId");

            migrationBuilder.RenameIndex(
                name: "IX_Commands_OriginPlayerId",
                table: "Commands",
                newName: "IX_Commands_OriginVillageGameId");

            migrationBuilder.RenameIndex(
                name: "IX_Commands_DestinyPlayerId",
                table: "Commands",
                newName: "IX_Commands_DestinyVillageGameId");

            migrationBuilder.AlterColumn<int>(
                name: "GameId",
                table: "OldCommands",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VillageGameId",
                table: "OldCommands",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VillageGameId1",
                table: "OldCommands",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "GameId",
                table: "Commands",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Players",
                table: "Players",
                column: "GameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OldCommands",
                table: "OldCommands",
                column: "GameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Commands",
                table: "Commands",
                column: "GameId");

            migrationBuilder.CreateTable(
                name: "Villages",
                columns: table => new
                {
                    GameId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerGameId = table.Column<int>(type: "int", nullable: false),
                    Coordinates_X = table.Column<int>(type: "int", nullable: false),
                    Coordinates_Y = table.Column<int>(type: "int", nullable: false),
                    TroopsSpearman = table.Column<int>(type: "int", nullable: false),
                    TroopsSword = table.Column<int>(type: "int", nullable: false),
                    TroopsViking = table.Column<int>(type: "int", nullable: false),
                    TroopsSpy = table.Column<int>(type: "int", nullable: false),
                    TroopsLight = table.Column<int>(type: "int", nullable: false),
                    TroopsHeavy = table.Column<int>(type: "int", nullable: false),
                    TroopsRam = table.Column<int>(type: "int", nullable: false),
                    TroopsCatapult = table.Column<int>(type: "int", nullable: false),
                    TroopsKnight = table.Column<int>(type: "int", nullable: false),
                    TroopsNobleman = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsSpearman = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsSword = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsViking = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsSpy = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsLight = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsHeavy = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsRam = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsCatapult = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsKnight = table.Column<int>(type: "int", nullable: false),
                    ForeignTroopsNobleman = table.Column<int>(type: "int", nullable: false),
                    Risk = table.Column<int>(type: "int", nullable: false),
                    Loyalty = table.Column<int>(type: "int", nullable: false),
                    WallLevel = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Villages", x => x.GameId);
                    table.ForeignKey(
                        name: "FK_Villages_Players_OwnerGameId",
                        column: x => x.OwnerGameId,
                        principalTable: "Players",
                        principalColumn: "GameId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OldCommands_VillageGameId",
                table: "OldCommands",
                column: "VillageGameId");

            migrationBuilder.CreateIndex(
                name: "IX_OldCommands_VillageGameId1",
                table: "OldCommands",
                column: "VillageGameId1");

            migrationBuilder.CreateIndex(
                name: "IX_Villages_OwnerGameId",
                table: "Villages",
                column: "OwnerGameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Commands_Villages_DestinyVillageGameId",
                table: "Commands",
                column: "DestinyVillageGameId",
                principalTable: "Villages",
                principalColumn: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Commands_Villages_OriginVillageGameId",
                table: "Commands",
                column: "OriginVillageGameId",
                principalTable: "Villages",
                principalColumn: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_OldCommands_Villages_DestinyVillageGameId",
                table: "OldCommands",
                column: "DestinyVillageGameId",
                principalTable: "Villages",
                principalColumn: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_OldCommands_Villages_OriginVillageGameId",
                table: "OldCommands",
                column: "OriginVillageGameId",
                principalTable: "Villages",
                principalColumn: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_OldCommands_Villages_VillageGameId",
                table: "OldCommands",
                column: "VillageGameId",
                principalTable: "Villages",
                principalColumn: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_OldCommands_Villages_VillageGameId1",
                table: "OldCommands",
                column: "VillageGameId1",
                principalTable: "Villages",
                principalColumn: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Commands_Villages_DestinyVillageGameId",
                table: "Commands");

            migrationBuilder.DropForeignKey(
                name: "FK_Commands_Villages_OriginVillageGameId",
                table: "Commands");

            migrationBuilder.DropForeignKey(
                name: "FK_OldCommands_Villages_DestinyVillageGameId",
                table: "OldCommands");

            migrationBuilder.DropForeignKey(
                name: "FK_OldCommands_Villages_OriginVillageGameId",
                table: "OldCommands");

            migrationBuilder.DropForeignKey(
                name: "FK_OldCommands_Villages_VillageGameId",
                table: "OldCommands");

            migrationBuilder.DropForeignKey(
                name: "FK_OldCommands_Villages_VillageGameId1",
                table: "OldCommands");

            migrationBuilder.DropTable(
                name: "Villages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Players",
                table: "Players");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OldCommands",
                table: "OldCommands");

            migrationBuilder.DropIndex(
                name: "IX_OldCommands_VillageGameId",
                table: "OldCommands");

            migrationBuilder.DropIndex(
                name: "IX_OldCommands_VillageGameId1",
                table: "OldCommands");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Commands",
                table: "Commands");

            migrationBuilder.DropColumn(
                name: "VillageGameId",
                table: "OldCommands");

            migrationBuilder.DropColumn(
                name: "VillageGameId1",
                table: "OldCommands");

            migrationBuilder.RenameColumn(
                name: "OriginVillageGameId",
                table: "OldCommands",
                newName: "OriginPlayerId");

            migrationBuilder.RenameColumn(
                name: "DestinyVillageGameId",
                table: "OldCommands",
                newName: "DestinyPlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_OldCommands_OriginVillageGameId",
                table: "OldCommands",
                newName: "IX_OldCommands_OriginPlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_OldCommands_DestinyVillageGameId",
                table: "OldCommands",
                newName: "IX_OldCommands_DestinyPlayerId");

            migrationBuilder.RenameColumn(
                name: "OriginVillageGameId",
                table: "Commands",
                newName: "OriginPlayerId");

            migrationBuilder.RenameColumn(
                name: "DestinyVillageGameId",
                table: "Commands",
                newName: "DestinyPlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_Commands_OriginVillageGameId",
                table: "Commands",
                newName: "IX_Commands_OriginPlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_Commands_DestinyVillageGameId",
                table: "Commands",
                newName: "IX_Commands_DestinyPlayerId");

            migrationBuilder.CreateSequence(
                name: "CommandSequence");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Players",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "GameId",
                table: "OldCommands",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "OldCommands",
                type: "int",
                nullable: false,
                defaultValueSql: "NEXT VALUE FOR [CommandSequence]");

            migrationBuilder.AddColumn<string>(
                name: "DestinyVillage",
                table: "OldCommands",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OriginVillage",
                table: "OldCommands",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "GameId",
                table: "Commands",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Commands",
                type: "int",
                nullable: false,
                defaultValueSql: "NEXT VALUE FOR [CommandSequence]");

            migrationBuilder.AddColumn<string>(
                name: "DestinyVillage",
                table: "Commands",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OriginVillage",
                table: "Commands",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Players",
                table: "Players",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OldCommands",
                table: "OldCommands",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Commands",
                table: "Commands",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Commands_Players_DestinyPlayerId",
                table: "Commands",
                column: "DestinyPlayerId",
                principalTable: "Players",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Commands_Players_OriginPlayerId",
                table: "Commands",
                column: "OriginPlayerId",
                principalTable: "Players",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OldCommands_Players_DestinyPlayerId",
                table: "OldCommands",
                column: "DestinyPlayerId",
                principalTable: "Players",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OldCommands_Players_OriginPlayerId",
                table: "OldCommands",
                column: "OriginPlayerId",
                principalTable: "Players",
                principalColumn: "Id");
        }
    }
}

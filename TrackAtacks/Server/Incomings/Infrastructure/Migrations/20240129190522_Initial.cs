using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "CommandSequence");

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    TribeId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Commands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, defaultValueSql: "NEXT VALUE FOR [CommandSequence]"),
                    GameId = table.Column<int>(type: "int", nullable: true),
                    OriginVillage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DestinyVillage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OriginPlayerId = table.Column<int>(type: "int", nullable: false),
                    DestinyPlayerId = table.Column<int>(type: "int", nullable: false),
                    LandTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Commands", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Commands_Players_DestinyPlayerId",
                        column: x => x.DestinyPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Commands_Players_OriginPlayerId",
                        column: x => x.OriginPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OldCommands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false, defaultValueSql: "NEXT VALUE FOR [CommandSequence]"),
                    GameId = table.Column<int>(type: "int", nullable: true),
                    OriginVillage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DestinyVillage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OriginPlayerId = table.Column<int>(type: "int", nullable: false),
                    DestinyPlayerId = table.Column<int>(type: "int", nullable: false),
                    LandTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReportId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OldCommands", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OldCommands_Players_DestinyPlayerId",
                        column: x => x.DestinyPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_OldCommands_Players_OriginPlayerId",
                        column: x => x.OriginPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Commands_DestinyPlayerId",
                table: "Commands",
                column: "DestinyPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Commands_OriginPlayerId",
                table: "Commands",
                column: "OriginPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_OldCommands_DestinyPlayerId",
                table: "OldCommands",
                column: "DestinyPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_OldCommands_OriginPlayerId",
                table: "OldCommands",
                column: "OriginPlayerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Commands");

            migrationBuilder.DropTable(
                name: "OldCommands");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropSequence(
                name: "CommandSequence");
        }
    }
}

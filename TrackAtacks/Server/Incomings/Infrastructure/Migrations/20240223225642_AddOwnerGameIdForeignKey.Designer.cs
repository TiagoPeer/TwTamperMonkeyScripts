﻿// <auto-generated />
using System;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20240223225642_AddOwnerGameIdForeignKey")]
    partial class AddOwnerGameIdForeignKey
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Core.Entities.Command", b =>
                {
                    b.Property<int?>("GameId")
                        .HasColumnType("int");

                    b.Property<int>("DestinyVillageGameId")
                        .HasColumnType("int");

                    b.Property<DateTime>("LandTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("OriginVillageGameId")
                        .HasColumnType("int");

                    b.HasKey("GameId");

                    b.HasIndex("DestinyVillageGameId");

                    b.HasIndex("OriginVillageGameId");

                    b.ToTable("Commands", (string)null);

                    b.UseTpcMappingStrategy();
                });

            modelBuilder.Entity("Core.Entities.Player", b =>
                {
                    b.Property<int>("GameId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TribeId")
                        .HasColumnType("int");

                    b.HasKey("GameId");

                    b.ToTable("Players");
                });

            modelBuilder.Entity("Core.Entities.Village", b =>
                {
                    b.Property<int>("GameId")
                        .HasColumnType("int");

                    b.Property<int>("Loyalty")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OwnerGameId")
                        .HasColumnType("int");

                    b.Property<int>("Risk")
                        .HasColumnType("int");

                    b.Property<int>("WallLevel")
                        .HasColumnType("int");

                    b.HasKey("GameId");

                    b.HasIndex("OwnerGameId");

                    b.ToTable("Villages");
                });

            modelBuilder.Entity("Core.Entities.OldCommand", b =>
                {
                    b.HasBaseType("Core.Entities.Command");

                    b.Property<int?>("ReportId")
                        .HasColumnType("int");

                    b.Property<int?>("VillageGameId")
                        .HasColumnType("int");

                    b.Property<int?>("VillageGameId1")
                        .HasColumnType("int");

                    b.HasIndex("VillageGameId");

                    b.HasIndex("VillageGameId1");

                    b.ToTable("OldCommands", (string)null);
                });

            modelBuilder.Entity("Core.Entities.Command", b =>
                {
                    b.HasOne("Core.Entities.Village", "DestinyVillage")
                        .WithMany("Incomings")
                        .HasForeignKey("DestinyVillageGameId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Core.Entities.Village", "OriginVillage")
                        .WithMany("Commands")
                        .HasForeignKey("OriginVillageGameId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("DestinyVillage");

                    b.Navigation("OriginVillage");
                });

            modelBuilder.Entity("Core.Entities.Village", b =>
                {
                    b.HasOne("Core.Entities.Player", "Owner")
                        .WithMany("Villages")
                        .HasForeignKey("OwnerGameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("Core.Entities.Coordinates", "Coordinates", b1 =>
                        {
                            b1.Property<int>("VillageGameId")
                                .HasColumnType("int");

                            b1.Property<int>("X")
                                .HasColumnType("int");

                            b1.Property<int>("Y")
                                .HasColumnType("int");

                            b1.HasKey("VillageGameId");

                            b1.ToTable("Villages");

                            b1.WithOwner()
                                .HasForeignKey("VillageGameId");
                        });

                    b.OwnsOne("Core.Entities.TroopCounts", "ForeignTroops", b1 =>
                        {
                            b1.Property<int>("VillageGameId")
                                .HasColumnType("int");

                            b1.Property<int>("Catapult")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsCatapult");

                            b1.Property<int>("Heavy")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsHeavy");

                            b1.Property<int>("Knight")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsKnight");

                            b1.Property<int>("Light")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsLight");

                            b1.Property<int>("Nobleman")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsNobleman");

                            b1.Property<int>("Ram")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsRam");

                            b1.Property<int>("Spearman")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsSpearman");

                            b1.Property<int>("Spy")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsSpy");

                            b1.Property<int>("Sword")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsSword");

                            b1.Property<int>("Viking")
                                .HasColumnType("int")
                                .HasColumnName("ForeignTroopsViking");

                            b1.HasKey("VillageGameId");

                            b1.ToTable("Villages");

                            b1.WithOwner()
                                .HasForeignKey("VillageGameId");
                        });

                    b.OwnsOne("Core.Entities.TroopCounts", "Troops", b1 =>
                        {
                            b1.Property<int>("VillageGameId")
                                .HasColumnType("int");

                            b1.Property<int>("Catapult")
                                .HasColumnType("int")
                                .HasColumnName("TroopsCatapult");

                            b1.Property<int>("Heavy")
                                .HasColumnType("int")
                                .HasColumnName("TroopsHeavy");

                            b1.Property<int>("Knight")
                                .HasColumnType("int")
                                .HasColumnName("TroopsKnight");

                            b1.Property<int>("Light")
                                .HasColumnType("int")
                                .HasColumnName("TroopsLight");

                            b1.Property<int>("Nobleman")
                                .HasColumnType("int")
                                .HasColumnName("TroopsNobleman");

                            b1.Property<int>("Ram")
                                .HasColumnType("int")
                                .HasColumnName("TroopsRam");

                            b1.Property<int>("Spearman")
                                .HasColumnType("int")
                                .HasColumnName("TroopsSpearman");

                            b1.Property<int>("Spy")
                                .HasColumnType("int")
                                .HasColumnName("TroopsSpy");

                            b1.Property<int>("Sword")
                                .HasColumnType("int")
                                .HasColumnName("TroopsSword");

                            b1.Property<int>("Viking")
                                .HasColumnType("int")
                                .HasColumnName("TroopsViking");

                            b1.HasKey("VillageGameId");

                            b1.ToTable("Villages");

                            b1.WithOwner()
                                .HasForeignKey("VillageGameId");
                        });

                    b.Navigation("Coordinates")
                        .IsRequired();

                    b.Navigation("ForeignTroops")
                        .IsRequired();

                    b.Navigation("Owner");

                    b.Navigation("Troops")
                        .IsRequired();
                });

            modelBuilder.Entity("Core.Entities.OldCommand", b =>
                {
                    b.HasOne("Core.Entities.Village", null)
                        .WithMany("OldCommands")
                        .HasForeignKey("VillageGameId");

                    b.HasOne("Core.Entities.Village", null)
                        .WithMany("OldIncomings")
                        .HasForeignKey("VillageGameId1");
                });

            modelBuilder.Entity("Core.Entities.Player", b =>
                {
                    b.Navigation("Villages");
                });

            modelBuilder.Entity("Core.Entities.Village", b =>
                {
                    b.Navigation("Commands");

                    b.Navigation("Incomings");

                    b.Navigation("OldCommands");

                    b.Navigation("OldIncomings");
                });
#pragma warning restore 612, 618
        }
    }
}
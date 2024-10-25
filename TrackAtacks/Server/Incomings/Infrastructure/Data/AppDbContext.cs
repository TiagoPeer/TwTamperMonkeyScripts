using Application.Interfaces.Services;
using Core.Entities;
using Infrastructure.Data.Interceptors;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    private readonly INotificationService _notificationService;
    public DbSet<Player> Players { get; set; }
    public DbSet<Command> Commands { get; set; }
    public DbSet<OldCommand> OldCommands { get; set; }
    public DbSet<Village> Villages { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) :
           base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Ignore<TwUnit>();

        builder.Entity<Command>().UseTpcMappingStrategy().ToTable("Commands");
        builder.Entity<OldCommand>().ToTable("OldCommands");

        builder.Entity<Command>().HasOne(c => c.DestinyVillage).WithMany(p => p.Incomings).OnDelete(DeleteBehavior.NoAction);
        builder.Entity<Command>().HasOne(c => c.OriginVillage).WithMany(p => p.Commands).OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Player>().HasKey(p => p.GameId);
        builder.Entity<Player>().HasMany(p => p.Villages).WithOne(v => v.Owner).HasForeignKey(v => v.OwnerGameId);
        builder.Entity<Village>().HasKey(p => p.GameId);
        builder.Entity<Command>().HasKey(p => p.GameId);

        builder.Entity<Village>().OwnsOne(typeof(Coordinates), "Coordinates");
        builder.Entity<Village>(village =>
        {
            village.OwnsOne(v => v.Troops, troopCounts =>
            {
                troopCounts.Property(tc => tc.Spearman).HasColumnName("TroopsSpearman");
                troopCounts.Property(tc => tc.Sword).HasColumnName("TroopsSword");
                troopCounts.Property(tc => tc.Viking).HasColumnName("TroopsViking");
                troopCounts.Property(tc => tc.Spy).HasColumnName("TroopsSpy");
                troopCounts.Property(tc => tc.Light).HasColumnName("TroopsLight");
                troopCounts.Property(tc => tc.Heavy).HasColumnName("TroopsHeavy");
                troopCounts.Property(tc => tc.Ram).HasColumnName("TroopsRam");
                troopCounts.Property(tc => tc.Catapult).HasColumnName("TroopsCatapult");
                troopCounts.Property(tc => tc.Knight).HasColumnName("TroopsKnight");
                troopCounts.Property(tc => tc.Nobleman).HasColumnName("TroopsNobleman");
            });

            village.OwnsOne(v => v.ForeignTroops, foreignTroopCounts =>
            {
                foreignTroopCounts.Property(tc => tc.Spearman).HasColumnName("ForeignTroopsSpearman");
                foreignTroopCounts.Property(tc => tc.Sword).HasColumnName("ForeignTroopsSword");
                foreignTroopCounts.Property(tc => tc.Viking).HasColumnName("ForeignTroopsViking");
                foreignTroopCounts.Property(tc => tc.Spy).HasColumnName("ForeignTroopsSpy");
                foreignTroopCounts.Property(tc => tc.Light).HasColumnName("ForeignTroopsLight");
                foreignTroopCounts.Property(tc => tc.Heavy).HasColumnName("ForeignTroopsHeavy");
                foreignTroopCounts.Property(tc => tc.Ram).HasColumnName("ForeignTroopsRam");
                foreignTroopCounts.Property(tc => tc.Catapult).HasColumnName("ForeignTroopsCatapult");
                foreignTroopCounts.Property(tc => tc.Knight).HasColumnName("ForeignTroopsKnight");
                foreignTroopCounts.Property(tc => tc.Nobleman).HasColumnName("ForeignTroopsNobleman");
            });
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Check for added User entities
        foreach (var entry in ChangeTracker.Entries<Command>())
        {
            if (entry.State == EntityState.Added)
            {
                await _notificationService.SendNotificationAsync($"new command received {entry.Entity.DestinyVillage.Owner.TribeId}");
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}

using Core.Entities;
using Infrastructure.Helpers;
using FluentAssertions;

namespace Tests;

[TestClass]
public class ParsersTest
{
    //[TestMethod]
    //public void ParseText_ShoudlIdentifyTwoCommands()
    //{
    //    //Arrange
    //    var text = @"Comando (2) \tDestino \tOrigem \tJogador \tDistância \tChegada \tChega em\r\n
    //                    Ataque \t001 Nobre Marreco (529|424) K45 \t022 Nobre Marreco (528|424) K45 \tdrumxs \t1 \thoje às 17:57:19:731\t\t0:08:45\r\n
    //                    Ataque \t001 Nobre Marreco (529|424) K45 \t022 Nobre Marreco (528|424) K45 \tdrumxs \t1 \thoje às 17:57:23:740\t\t0:08:49\r\n
    //                    selecionar tudo \t\r\nConfigura a Etiqueta";

    //    //Act
    //    var expected = new List<Command>()
    //    {
    //        new("528|424", "529|424" ,"drumxs", "drumxs", new DateTime(2024,1,22,17,57,19,731), null, null),
    //        new("528|424", "529|424" ,"drumxs", "drumxs", new DateTime(2024,1,22,17,57,23,740), null, null)
    //    };

    //    //Assert
    //    var commands = text.ParseCommands();
    //    expected.Should().BeEquivalentTo(commands);
    //}

    [TestMethod]
    [DataRow("hoje às 17:57:19:731", 2024, 1, 22, 17, 57, 19, 731)]
    [DataRow("hoje às 17:57:23:740", 2024, 1, 22, 17, 57, 23, 740)] 
    public void CompareDates_ShouldReturnTrue(string text, int year, int month, int day, int hour, int minute, int second, int millisecond)
    {
        // Arrange
        var expected = new DateTime(year, month, day, hour, minute, second, millisecond);

        // Act
        var date = text.ParseDateString();

        // Assert
        Assert.AreEqual(expected, date);
    }
}
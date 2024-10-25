using System.Text;
using Application.Interfaces.Services;
using Core.DTOs.Incomings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebAPI.Controllers;

[ApiController]
[Route("[controller]")]
[AllowAnonymous]
public class IncomingsController : ControllerBase
{

    private readonly IIncomingsService _incomingsService;

    public IncomingsController(IIncomingsService incomingsService)
    {
        _incomingsService = incomingsService;
    }

    [HttpGet]
    [Route("update")]
    public async Task<IActionResult> Send(string data)
    {
        var incomingRequest = JsonConvert.DeserializeObject<UpdateIncomingsRequestDTO>(data);

        await Console.Out.WriteLineAsync("Ataques recebidos");
        await Console.Out.WriteLineAsync(data);

        if (incomingRequest is null) return Ok();

        await _incomingsService.UpdatePlayerIncomingsAsync(incomingRequest);
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> Ping()
    {
        using (StreamReader reader = new(Request.Body, Encoding.UTF8))
        {
            string requestBody = await reader.ReadToEndAsync();
            Console.WriteLine($"Received data: {requestBody}");

            // Process the requestBody as needed
        }
        return Ok();
    }
}
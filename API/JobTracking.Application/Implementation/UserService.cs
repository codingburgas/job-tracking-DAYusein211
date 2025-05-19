using Azure.Core.Pipeline;
using JobTracking.Application.Contracts.Base;
using JobTracking.DataAccess.Models;

namespace JobTracking.Application.Implementation;

public class UserService : IUserService
{
    public Task<IQueryable<User>> GetUsers()
    {
        
        throw new NotImplementedException();
    }
}
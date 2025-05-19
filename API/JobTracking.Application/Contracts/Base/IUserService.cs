using JobTracking.DataAccess.Models;

namespace JobTracking.Application.Contracts.Base;

public interface IUserService
{
    public Task<IQueryable<User>> GetUsers();
}